from django.db import models
from django.conf import settings
# Create your models here.
from django.contrib.auth.models import AbstractUser
import uuid
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
import random
import string
from django.db import models
# --- 1. UTILISATEUR DE BASE (Héritage de User) ---
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
'''
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        GESTIONNAIRE = "GESTIONNAIRE", "Gestionnaire"
        LIVREUR = "LIVREUR", "Livreur"
        CLIENT = "CLIENT", "Client"
    
    role = models.CharField(
        max_length=20, 
        choices=Role.choices, 
        default=Role.CLIENT
    )

    def __str__(self):
        return f"{self.username} ({self.role})"

'''

# --- 2. PROFILS SPÉCIFIQUES (Attributs du Diagramme) ---

class Client(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='client_profile')
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    address_text = models.TextField()
    address_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    address_long = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return self.full_name

class Livreur(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='livreur_profile')
    vehicle_info = models.CharField(max_length=255)
    is_available = models.BooleanField(default=True)
    current_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_long = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return f"Livreur: {self.user.username} [{self.vehicle_info}]"


# --- 3. LA COMMANDE (Relation entre Client, Livreur et Gestionnaire) ---

from django.conf import settings
# models.py - CORRECT WAY
# models.py - CORRECT WAY
class Commande(models.Model):
    tracking_id = models.CharField(max_length=50, unique=True)
    client_name = models.CharField(max_length=100)
    client_phone = models.CharField(max_length=20)
    
    # ✅ FIXED: Add default value or allow null
    adresse_text = models.TextField(default="Adresse à définir")
    
    # ✅ ADD: Destination coordinates for map
    destination_lat = models.FloatField(null=True, blank=True)
    destination_long = models.FloatField(null=True, blank=True)
    
    statut = models.CharField(max_length=20, default='En attente')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_livraison = models.DateTimeField(null=True, blank=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    
    # ✅ FIXED: Driver relationship
    livreur = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'role': 'livreur'}
    )

    def __str__(self):
        return f"Commande {self.tracking_id}"

User = get_user_model()

class Notification(models.Model):
    """
    Notification model for drivers and clients
    """
    NOTIFICATION_TYPES = [
        ('order_assigned', 'Nouvelle commande assignée'),
        ('order_picked_up', 'Commande prise en charge'),
        ('order_delivered', 'Commande livrée'),
        ('order_cancelled', 'Commande annulée'),
        ('status_change', 'Changement de statut'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    notification_type = models.CharField(max_length=20, default='INFO')
    
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Optional: link to the commande
    commande = models.ForeignKey(
        'Commande',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['is_read']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    @property
    def time_ago(self):
        """Return human-readable time ago"""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - self.created_at
        
        if diff < timedelta(minutes=1):
            return "À l'instant"
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f"Il y a {minutes} min"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"Il y a {hours}h"
        elif diff < timedelta(days=7):
            days = diff.days
            return f"Il y a {days}j"
        else:
            return self.created_at.strftime("%d/%m/%Y")

# In logistics/views.py
 