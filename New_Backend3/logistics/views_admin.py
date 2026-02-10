from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

# On importe UNIQUEMENT ce qui existe vraiment
from authentication.serializers import UserSerializer
from .serializers import CommandeSerializer
from .models import Commande

User = get_user_model()


User = get_user_model()

# --- 1. PERMISSION PERSONNALISÉE (SÉCURITÉ) ---
class IsAdminOrManager(permissions.BasePermission):
    """
    Permission qui n'autorise que les Admins et Gestionnaires.
    """
    def has_permission(self, request, view):
        # Vérifie si l'utilisateur est connecté et a le bon rôle
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'GESTIONNAIRE']

# --- 2. DASHBOARD & STATISTIQUES ---
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        total_users = User.objects.count()
        # On compte les Users dont le rôle est LIVREUR
        total_livreurs = User.objects.filter(role='LIVREUR').count()
        # On utilise le champ is_available directement sur User
        livreurs_dispo = User.objects.filter(role='LIVREUR', is_available=True).count()
        
        total_commandes = Commande.objects.count()
        chiffre_affaires = Commande.objects.aggregate(Sum('montant'))['montant__sum'] or 0
        
        statuts = Commande.objects.values('statut').annotate(total=Count('statut'))

        return Response({
            "users_total": total_users,
            "livreurs_total": total_livreurs,
            "livreurs_online": livreurs_dispo,
            "commandes_total": total_commandes,
            "revenue_total": chiffre_affaires,
            "commandes_par_statut": statuts
        })

# --- 3. GESTION DES UTILISATEURS (CRUD COMPLET) ---
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrManager]

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Action pour activer/désactiver un compte utilisateur (bannissement)"""
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        status_text = "activé" if user.is_active else "désactivé"
        return Response({"status": f"Utilisateur {status_text}"})

# --- 4. GESTION DES LIVREURS ---
class AdminLivreurViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role="LIVREUR")
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrManager]

    @action(detail=True, methods=['get'])
    def location(self, request, pk=None):
        livreur = self.get_object() # C'est déjà un objet User
        return Response({
            "livreur": livreur.username, # Pas de .user ici
            "lat": livreur.current_lat,
            "long": livreur.current_long,
            "dispo": livreur.is_available
        })

# --- 5. SUPERVISION DES COMMANDES ---
class AdminCommandeViewSet(viewsets.ModelViewSet):
    queryset = Commande.objects.all().order_by('-date_creation')
    serializer_class = CommandeSerializer
    permission_classes = [IsAdminOrManager]

    def perform_create(self, serializer):
        # L'admin peut créer une commande manuellement
        serializer.save()

    @action(detail=True, methods=['post'])
    def assign_livreur(self, request, pk=None):
        """
        L'admin assigne manuellement une commande à un livreur spécifique.
        Body JSON attendu: { "livreur_id": 12 }
        """
        commande = self.get_object()
        livreur_id = request.data.get('livreur_id')
        
        if not livreur_id:
            return Response({"error": "ID Livreur manquant"}, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si le livreur existe
        try:
            # On cherche par l'ID du User associé au profil Livreur
            livreur_user = User.objects.get(id=livreur_id) 
            if livreur_user.role != 'LIVREUR':
                return Response({"error": "Cet utilisateur n'est pas un livreur"}, status=400)
        except User.DoesNotExist:
            return Response({"error": "Livreur introuvable"}, status=404)

        # Assigner
        commande.livreur = livreur_user
        commande.statut = "En cours" # Passe automatiquement en cours
        commande.save()
        
        return Response({
            "status": "Commande assignée avec succès",
            "livreur": livreur_user.username,
            "commande": commande.tracking_id
        })
    
