from rest_framework import serializers
from .models import Commande
from .models import Notification

class CommandeSerializer(serializers.ModelSerializer):
    # Affiche le nom du livreur au lieu de son ID
    livreur_name = serializers.SerializerMethodField()    
    # Mapping pour React : estFragile sera envoyé au frontend
    estFragile = serializers.BooleanField(source='est_fragile', read_only=True) 
    
    class Meta:
        model = Commande
        fields = '__all__' # Inclut tous les nouveaux champs (poids, notes, etc.)
    
    def get_livreur_name(self, obj):
        """
        Returns "First Last", or "Username" if name is missing.
        Returns None if no driver is assigned.
        """
        if obj.livreur:
            # Check if get_full_name method exists (standard Django user)
            if hasattr(obj.livreur, 'get_full_name'):
                full_name = obj.livreur.get_full_name().strip()
                if full_name:
                    return full_name
            
            # Fallback: Try manual combination
            manual_name = f"{obj.livreur.first_name} {obj.livreur.last_name}".strip()
            if manual_name:
                return manual_name
                
            # Final fallback: Username
            return obj.livreur.username
            
        return None  # Or "En attente"


class NotificationSerializer(serializers.ModelSerializer):
    time_ago = serializers.ReadOnlyField()
    tracking_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'title',
            'message',
            'is_read',
            'created_at',
            'time_ago',
            'tracking_id',
        ]
        read_only_fields = ['created_at']
    
    def get_tracking_id(self, obj):
        """Return tracking ID if notification is linked to a commande"""
        if obj.commande:
            return obj.commande.tracking_id
        return None