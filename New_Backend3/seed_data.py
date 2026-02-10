import os
import django
import random

# Initialisation de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'logistic.settings')
django.setup()

from authentication.models import User
from logistics.models import Livreur, Commande

def run_seed():
    print("--- Début du peuplement de la base de données ---")

    # 1. Création de 2 Gestionnaires (Admins)
    for i in range(2):
        username = f' {i}'
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username, 
                password='password123', 
                email=f'manager{i}@test.com',
                role='Admin' # Assure-toi que 'Admin' est bien une option de ton champ Role
            )
    print("✅ 2 Gestionnaires créés.")

    # 2. Création de 30 Clients
    for i in range(30):
        username = f'client_{i}'
        if not User.objects.filter(username=username).exists():
            User.objects.create_user(
                username=username, 
                password='password123', 
                role='Client'
            )
    print("✅ 30 Clients créés.")

    # 3. Création de 12 Livreurs
    for i in range(12):
        username = f'livreur_{i}'
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                password='password123', 
                role='Livreur'
            )
            # Création du profil Livreur lié
            Livreur.objects.create(
                user=user, 
                vehicle_info=random.choice(["Moto Yamaha", "Vespa", "Dacia Dokker", "Vélo"]),
                is_available=True
            )
    print("✅ 12 Livreurs créés.")

    print("--- Opération terminée avec succès ! ---")

if __name__ == '__main__':
    run_seed()