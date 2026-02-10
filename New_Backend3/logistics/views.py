from rest_framework import viewsets, exceptions, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import TruncDate
from collections import defaultdict
from .models import Commande
from .serializers import CommandeSerializer
from logistic.permissions import IsGestionnaireOrAdmin # Import depuis ton fichier image_1d83dc.png
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework import status as http_status

from rest_framework.decorators import api_view


class CommandeViewSet(viewsets.ModelViewSet):
    serializer_class = CommandeSerializer

    def get_permissions(self):
        # Seuls les Admins/Gestionnaires peuvent créer ou modifier (PUT/PATCH) la commande entière
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsGestionnaireOrAdmin()]
        # Le livreur peut voir la liste et utiliser l'action personnalisée
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        # Le livreur ne voit QUE ses commandes assignées
        if getattr(user, 'role', '') == 'LIVREUR':
            return Commande.objects.filter(livreur=user).order_by('-date_creation')
        # L'admin/Gestionnaire voit tout
        return Commande.objects.all().order_by('-date_creation')

    @action(detail=True, methods=['patch'])
    def update_statut(self, request, pk=None):
        """
        FONCTIONNALITÉ LIVREUR : 
        Permet de changer le statut sans pouvoir toucher à l'adresse ou au prix.
        """
        commande = self.get_object()
        
        # Sécurité supplémentaire : vérification du propriétaire de la course
        if getattr(request.user, 'role', '') == 'LIVREUR' and commande.livreur != request.user:
            raise exceptions.PermissionDenied("Ce n'est pas votre commande.")

        nouveau_statut = request.data.get('statut')
        if nouveau_statut in ['En cours', 'Livré', 'Annulé']:
            commande.statut = nouveau_statut
            commande.save()
            return Response({'status': f'Statut mis à jour : {nouveau_statut}'})
        
        return Response({'error': 'Statut invalide'}, status=400)
    
    def history(self, request):
        """
        Get delivery history for the current driver
        """
        user = request.user
        
        if user.role != 'LIVREUR':
            return Response(
                {'error': 'Seuls les livreurs peuvent accéder à l\'historique'},
                status=status.HTTP_403_FORBIDDEN
            )
         
        # Get completed deliveries
        history = Commande.objects.filter(
            livreur=user,
            statut='Livré'
        ).order_by('-date_livraison')
        
        serializer = self.get_serializer(history, many=True)
        
        # Calculate stats
        total_delivered = history.count()
        total_revenue = sum(cmd.montant for cmd in history)
        
        return Response({
            'total_delivered': total_delivered,
            'total_revenue': float(total_revenue),
            'deliveries': serializer.data
        })
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['statut', 'date_livraison', 'livreur']

class PublicTrackingView(APIView):
    """ Pour le client final : Tracking sans login via tracking_id """
    permission_classes = [permissions.AllowAny]

    def get(self, request, tracking_id):
        cmd = get_object_or_404(Commande, tracking_id=tracking_id)
        return Response({
            'tracking_id': cmd.tracking_id,
            'statut': cmd.statut,
            # On ne renvoie que la position GPS, pas les données privées
            'livreur_lat': cmd.livreur.current_lat if cmd.livreur else None,
            'livreur_long': cmd.livreur.current_long if cmd.livreur else None,
        })

class DriverLocationView(APIView):
    """ Flutter met à jour le GPS du livreur ici toutes les 5s """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.current_lat = request.data.get('lat')
        request.user.current_long = request.data.get('lng')
        request.user.save()
        return Response({'status': 'GPS Updated'})
    
from rest_framework import status  # ← Add this import at the top

class DriverAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        
        # Only drivers can toggle availability
        if user.role != 'LIVREUR':
            return Response(
                {'error': 'Seuls les livreurs peuvent modifier leur disponibilité'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        is_available = request.data.get('is_available')
        
        if is_available is None:
            return Response(
                {'error': 'Le champ is_available est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.is_available = is_available
        user.save()
        
        return Response({
            'message': 'Disponibilité mise à jour',
            'is_available': user.is_available
        })
    
class UpdateDriverAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        
        # 1. FIX: Use the correct related_name 'livreur_profile'
        if not hasattr(user, 'livreur_profile'):
            return Response(
                {"error": "Seuls les livreurs peuvent modifier leur disponibilité (Profil introuvable)"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get availability from request
        is_available = request.data.get('is_available')
        
        if is_available is None:
            return Response(
                {"error": "Le champ 'is_available' est requis"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 2. FIX: Access the profile correctly
        livreur = user.livreur_profile
        livreur.is_available = is_available
        livreur.save()
        
        return Response(
            {
                "success": True,
                "message": f"Disponibilité mise à jour: {'Disponible' if is_available else 'Indisponible'}",
                "is_available": is_available
            },
            status=status.HTTP_200_OK
        )


class CalendarView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Only admin/gestionnaire can access
        if request.user.role not in ['ADMIN', 'GESTIONNAIRE']:
            return Response({'error': 'Permission denied'}, status=403)
        
        # Get month and year from query params
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        
        if not month or not year:
            return Response(
                {'error': 'month and year query parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Filter commandes by month and year
        commandes = Commande.objects.filter(
            date_livraison__month=month,
            date_livraison__year=year
        ).values('date_livraison', 'statut').annotate(
            count=Count('id')
        )
        
        # Group by date
        calendar_data = defaultdict(lambda: {
            'date': None,
            'total': 0,
            'en_attente': 0,
            'en_cours': 0,
            'livre': 0,
            'annule': 0
        })
        
        for cmd in commandes:
            date_str = cmd['date_livraison'].strftime('%Y-%m-%d')
            calendar_data[date_str]['date'] = date_str
            calendar_data[date_str]['total'] += cmd['count']
            
            statut_key = cmd['statut'].lower().replace(' ', '_').replace('é', 'e')
            if statut_key in calendar_data[date_str]:
                calendar_data[date_str][statut_key] += cmd['count']
        
        return Response({
            'month': month,
            'year': year,
            'data': list(calendar_data.values())
        })
    
class PublicTrackingView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, tracking_id):
        # Validate tracking ID format
        if not tracking_id or len(tracking_id) < 5:
            return Response(
                {'error': 'Numéro de suivi invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cmd = Commande.objects.get(tracking_id=tracking_id)
        except Commande.DoesNotExist:
            return Response(
                {'error': 'Numéro de suivi introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        response_data = {
            'tracking_id': cmd.tracking_id,
            'statut': cmd.statut,
            'client_name': cmd.client_name,
            'adresse_text': cmd.adresse_text,
            'date_creation': cmd.date_creation,
        }
        
        # Only include driver location if delivery is in progress
        if cmd.livreur and cmd.statut == 'En cours':
            response_data.update({
                'livreur_name': cmd.livreur.username,
                'livreur_phone': cmd.livreur.phone,
                'livreur_lat': cmd.livreur.current_lat,
                'livreur_long': cmd.livreur.current_long,
            })
        
        return Response(response_data)







from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(APIView):
    """
    GET: List all notifications for the authenticated user
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        
        # Count unread notifications
        unread_count = notifications.filter(is_read=False).count()
        
        return Response({
            'notifications': serializer.data,
            'unread_count': unread_count,
        }, status=status.HTTP_200_OK)


class NotificationMarkAsReadView(APIView):
    """
    PATCH: Mark a notification as read
    """
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
            notification.is_read = True
            notification.save()
            
            serializer = NotificationSerializer(notification)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class NotificationMarkAllAsReadView(APIView):
    """
    POST: Mark all notifications as read
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        updated_count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response({
            'success': True,
            'message': f'{updated_count} notifications marquées comme lues',
            'updated_count': updated_count,
        }, status=status.HTTP_200_OK)


class NotificationDeleteView(APIView):
    """
    DELETE: Delete a notification
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
            notification.delete()
            
            return Response({
                'success': True,
                'message': 'Notification supprimée',
            }, status=status.HTTP_200_OK)
            
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class NotificationClearAllView(APIView):
    """
    DELETE: Clear all read notifications
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        deleted_count, _ = Notification.objects.filter(
            user=request.user,
            is_read=True
        ).delete()
        
        return Response({
            'success': True,
            'message': f'{deleted_count} notifications supprimées',
            'deleted_count': deleted_count,
        }, status=status.HTTP_200_OK)
    




class NotificationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        unread_count = notifications.filter(is_read=False).count()
        
        data = [{
            'id': n.id,
            'message': n.message,
            'is_read': n.is_read,
            'created_at': n.created_at,
        } for n in notifications[:10]]  # Last 10 notifications
        
        return Response({
            'unread_count': unread_count,
            'notifications': data
        })
    
    def patch(self, request, pk):
        """Mark notification as read"""
        notification = Notification.objects.get(pk=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marquée comme lue'})
    


from .utils import notify_driver_assignment, notify_client_status_change


class UpdateCommandeStatusView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, commande_id):
        try:
            commande = Commande.objects.get(id=commande_id)
            
            # Check if user is the assigned driver
            if not hasattr(request.user, 'livreur') or commande.livreur != request.user.livreur:
                return Response(
                    {"error": "Unauthorized"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            new_status = request.data.get('statut')
            
            if not new_status:
                return Response(
                    {"error": "Status is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update status
            old_status = commande.statut
            commande.statut = new_status
            
            # Update dates based on status
            if new_status == 'En cours' and not commande.date_prise_en_charge:
                commande.date_prise_en_charge = timezone.now()
            elif new_status == 'Livré' and not commande.date_livraison:
                commande.date_livraison = timezone.now()
            
            commande.save()
            
            # 🔔 CREATE NOTIFICATION FOR CLIENT
            notify_client_status_change(commande)
            
            serializer = CommandeSerializer(commande)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Commande.DoesNotExist:
            return Response(
                {"error": "Commande not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        

@api_view(['GET'])
def track_commande(request, tracking_id):
    try:
        commande = Commande.objects.get(tracking_id=tracking_id)
        
        # ✅ CHANGE THIS LINE:
        # OLD: livreur_name = commande.livreur.username if commande.livreur else None
        # NEW:
        livreur_name = commande.livreur.get_display_name() if commande.livreur else None
        
        data = {
            'tracking_id': commande.tracking_id,
            'statut': commande.statut,
            'client_name': commande.client_name,
            'adresse_text': commande.adresse,
            'livreur_name': livreur_name,  # ✅ Now shows full name
            'livreur_phone': commande.livreur.phone if commande.livreur else None,
            'livreur_lat': commande.livreur.current_lat if commande.livreur else None,
            'livreur_long': commande.livreur.current_long if commande.livreur else None,
            'destination_lat': getattr(commande, 'destination_lat', None),
            'destination_long': getattr(commande, 'destination_long', None),
            'date_creation': commande.date_creation,
            'date_en_cours': getattr(commande, 'date_en_cours', None),
            'date_livraison': commande.date_livraison,
            'montant': float(commande.montant) if commande.montant else None,
        }
        
        return Response(data)
    except Commande.DoesNotExist:
        return Response({'error': 'Tracking ID not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)