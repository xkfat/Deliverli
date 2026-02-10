from rest_framework import viewsets, generics, permissions
from rest_framework import serializers  # <--- AJOUTE CETTE LIGNE
from logistics.models import Commande  # <--- AJOUTE CETTE LIGNE
       # L'import que tu viens d'ajouter
from .models import User

from django.contrib.auth import get_user_model
# Attention : il faudra aussi que le Serializer existe (voir étape 2)
from .serializers import UserSerializer 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()

# 1. Vue pour gérer l'équipe (Visible seulement par l'Admin)
class TeamViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

# 2. Vue pour le profil connecté (Pour que Flutter sache "Qui suis-je ?")
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Renvoie uniquement l'utilisateur actuellement connecté
        return self.request.user
    


from rest_framework import status
from django.contrib.auth.hashers import check_password

class ChangePasswordView(APIView):
    def post(self, request):
        # Remove this line: print(f"🔍 Request body: {request.body}")
        print(f"🔍 Request data: {request.data}")  # Keep only this
        
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response({"error": "Champs requis"}, status=400)
        
        if not request.user.check_password(old_password):
            return Response({"error": "Ancien mot de passe incorrect"}, status=400)
        
        request.user.set_password(new_password)
        request.user.save()
        
        return Response({"success": True, "message": "Mot de passe changé"})
    
from rest_framework.parsers import MultiPartParser, FormParser

class ProfilePhotoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def patch(self, request):
        user = request.user
        
        if 'profile_photo' not in request.FILES:
            return Response(
                {'error': 'Aucune photo fournie'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.profile_photo = request.FILES['profile_photo']
        user.save()
        serializer = UserSerializer(user, context={'request': request})

        return Response({
            'message': 'Photo de profil mise à jour',
            'profile_photo_url': request.build_absolute_uri(user.profile_photo.url) if user.profile_photo else None
        })
    
    def delete(self, request):
        user = request.user
        if user.profile_photo:
            user.profile_photo.delete()
            user.save()
        return Response({'message': 'Photo de profil supprimée'})

class ProfilePhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        photo_file = request.FILES.get('profile_photo')
        
        if not photo_file:
            return Response(
                {"error": "No photo file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save the photo
        user.profile_photo = photo_file
        user.save()
        
        # Return the full URL with request context
        serializer = UserSerializer(user, context={'request': request})  # ← Add context
        
        return Response(
            {
                "success": True,
                "message": "Photo de profil mise à jour",
                "profile_photo_url": serializer.data.get('profile_photo_url')  # ← Full URL
            },
            status=status.HTTP_200_OK
        )
    

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist() # Met le token sur liste noire
            return Response({"message": "Déconnexion réussie"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Token invalide"}, status=status.HTTP_400_BAD_REQUEST)
        

class TrackingSerializer(serializers.ModelSerializer):
    # ✅ Use driver's full name, not username!
    livreur_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Commande
        fields = [
            'tracking_id',
            'statut',
            'client_name',
            'adresse_text',
            'date_creation',
            'date_collecte',      # ✅ Add this
            'date_en_cours',      # ✅ Add this
            'date_livraison',     # ✅ Add this
            'montant',
            'livreur_name',       # ✅ Full name, not username
            'livreur_phone',
            'livreur_lat',
            'livreur_long',
            'destination_lat',    # ✅ Add this
            'destination_long',   # ✅ Add this
        ]
    
    def get_livreur_name(self, obj):
        """Return driver's full name"""
        if obj.livreur:
            # ✅ Return full name, not username
            if obj.livreur.first_name and obj.livreur.last_name:
                return f"{obj.livreur.first_name} {obj.livreur.last_name}"
            return obj.livreur.get_full_name() or obj.livreur.username
        return None