from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Administrateur"
        GESTIONNAIRE = "GESTIONNAIRE", "Gestionnaire"
        LIVREUR = "LIVREUR", "Livreur"
        CLIENT = "CLIENT", "Client"
    
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    phone = models.CharField(max_length=20, blank=True)
    
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    
    # Champs spécifiques Livreur (Plan Technique)
    vehicle_info = models.CharField(max_length=100, blank=True)
    is_available = models.BooleanField(default=True)
    current_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_long = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
    

    