import random
import string
from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

# --- 2. PROFILS SPÉCIFIQUES ---

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


# --- 3. LA COMMANDE ---

class Commande(models.Model):
    # ✅ FIX 1: set editable=False so it doesn't show in Admin form
    tracking_id = models.CharField(max_length=50, unique=True, editable=False)
    
    client_name = models.CharField(max_length=100)
    client_phone = models.CharField(max_length=20)
    
    adresse_text = models.TextField(default="Adresse à définir")
    
    latitude = models.FloatField(null=True, blank=True)  
    longitude = models.FloatField(null=True, blank=True)
    
    class StatutChoices(models.TextChoices):       
        EN_ATTENTE = 'En attente', 'En attente'
        ASSIGNEE = 'Assignée', 'Assignée'
        EN_COURS = 'En cours', 'En cours'
        EN_LIVRAISON = 'En livraison', 'En livraison'
        LIVRE = 'Livré', 'Livré'
        ANNULE = 'Annulé', 'Annulé'
        ECHOUE = 'Échoué', 'Échoué'
        RETOUR = 'Retour', 'Retour'

    statut = models.CharField(max_length=20, choices=StatutChoices.choices,  default=StatutChoices.EN_ATTENTE)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_livraison = models.DateTimeField(null=True, blank=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    
    est_fragile = models.BooleanField(default=False)
    poids = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    dimensions = models.CharField(max_length=50, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    date_livraison = models.DateField(null=True, blank=True, verbose_name="Date de Livraison Prévue")
    livreur = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'role__iexact': 'livreur'}
    )

    # ✅ FIX 2: This method generates the ID
    def generate_tracking_id(self):
        """Generate a short, unique tracking ID like: LIV-ABC12345"""
        while True:
            letters = ''.join(random.choices(string.ascii_uppercase, k=3))
            numbers = ''.join(random.choices(string.digits, k=5))
            new_id = f"LIV-{letters}{numbers}"
            
            # Ensure it is unique in the database
            if not Commande.objects.filter(tracking_id=new_id).exists():
                return new_id

    # ✅ FIX 3: Override save() to ACTUALLY call the generator
    def save(self, *args, **kwargs):
        if not self.tracking_id:
            self.tracking_id = self.generate_tracking_id()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Commande {self.tracking_id}"

class Notification(models.Model):
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