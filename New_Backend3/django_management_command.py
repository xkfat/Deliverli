"""
Django Management Command: Generate Mock Data for Rabat Logistics
Place this file in: logistics/management/commands/generate_rabat_data.py

Usage: python manage.py generate_rabat_data
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from logistics.models import Client, Livreur, Commande, Notification
from datetime import datetime, timedelta
import random
import uuid


class Command(BaseCommand):
    help = 'Generate realistic mock data for Rabat logistics app'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users', type=int, default=30,
            help='Number of users to create'
        )
        parser.add_argument(
            '--orders', type=int, default=50,
            help='Number of orders to create'
        )
        parser.add_argument(
            '--clear', action='store_true',
            help='Clear existing data before generating new data'
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.clear_data()
        
        users = self.create_users(options['users'])
        clients = self.create_clients(users)
        livreurs = self.create_livreurs(users)
        commandes = self.create_commandes(clients, livreurs, options['orders'])
        notifications = self.create_notifications(users, commandes)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully generated:\n'
                f'- {len(users)} users\n'
                f'- {len(clients)} clients\n'
                f'- {len(livreurs)} drivers\n'
                f'- {len(commandes)} orders\n'
                f'- {len(notifications)} notifications'
            )
        )

    def clear_data(self):
        """Clear existing test data"""
        self.stdout.write('Clearing existing data...')
        Notification.objects.all().delete()
        Commande.objects.all().delete()
        Client.objects.all().delete()
        Livreur.objects.all().delete()
        User.objects.filter(email__contains='mock').delete()

    def generate_phone(self):
        """Generate Moroccan phone number"""
        return f"+212{random.choice(['6', '7'])}{random.randint(10000000, 99999999)}"

    def generate_moroccan_name(self):
        """Generate Moroccan names"""
        first_names = [
            'Ahmed', 'Mohammed', 'Fatima', 'Aicha', 'Youssef', 'Khadija',
            'Hassan', 'Latifa', 'Omar', 'Nadia', 'Rachid', 'Samira',
            'Karim', 'Zineb', 'Abdelkader', 'Malika', 'Said', 'Houda'
        ]
        
        last_names = [
            'Alami', 'Benali', 'Cherkaoui', 'Fassi', 'Tazi', 'Benjelloun',
            'El Alaoui', 'Chakir', 'Berrada', 'Filali', 'Lahlou', 'Sefrioui'
        ]
        
        return random.choice(first_names), random.choice(last_names)

    def generate_rabat_address(self):
        """Generate realistic Rabat addresses"""
        neighborhoods = [
            'Agdal', 'Hassan', 'Hay Riad', 'Souissi', 'Aviation', 'Ocean',
            'Medina', 'Mechouar', 'Youssoufia', 'Akkari', 'Diour Jamaa'
        ]
        
        streets = [
            'Avenue Mohamed VI', 'Rue Allal El Fassi', 'Boulevard Hassan II',
            'Avenue des Nations Unies', 'Rue Ibn Sina', 'Avenue Al Marsa'
        ]
        
        neighborhood = random.choice(neighborhoods)
        street = random.choice(streets)
        number = random.randint(1, 200)
        
        return f"{number} {street}, {neighborhood}, Rabat"

    def generate_coordinates_rabat(self):
        """Generate coordinates within Rabat bounds"""
        lat = round(random.uniform(33.95, 34.05), 6)
        lng = round(random.uniform(-6.87, -6.80), 6)
        return lat, lng

    def create_users(self, count):
        """Create users with different roles"""
        users = []
        
        for i in range(count):
            first_name, last_name = self.generate_moroccan_name()
            username = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}"
            email = f"{username}.mock@menara.ma"
            
            # Assign roles
            if i < 5:
                role = 'gestionnaire'
                is_staff = True
            elif i < 15:
                role = 'livreur'
                is_staff = False
            else:
                role = 'client'
                is_staff = False
            
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                is_staff=is_staff,
                is_active=True
            )
            
            # Add custom role field (if you have it)
            if hasattr(user, 'role'):
                user.role = role
                user.save()
            
            users.append(user)
        
        self.stdout.write(f'Created {len(users)} users')
        return users

    def create_clients(self, users):
        """Create Client profiles"""
        clients = []
        client_users = [u for u in users if not u.is_staff and not hasattr(u, 'livreur_profile')]
        
        for user in client_users[:15]:  # First 15 non-staff users as clients
            lat, lng = self.generate_coordinates_rabat()
            
            client = Client.objects.create(
                user=user,
                full_name=f"{user.first_name} {user.last_name}",
                phone_number=self.generate_phone(),
                address_text=self.generate_rabat_address(),
                address_lat=lat,
                address_long=lng
            )
            clients.append(client)
        
        self.stdout.write(f'Created {len(clients)} client profiles')
        return clients

    def create_livreurs(self, users):
        """Create Livreur profiles"""
        livreurs = []
        # Get users that could be drivers (not staff, not already clients)
        potential_drivers = [u for u in users if not u.is_staff][-10:]  # Last 10 users
        
        vehicles = [
            'Moto Yamaha 125cc', 'Scooter Honda 150cc', 'Moto Suzuki 200cc',
            'Vélo électrique', 'Scooter Piaggio', 'Moto Kawasaki 250cc'
        ]
        
        for user in potential_drivers:
            lat, lng = self.generate_coordinates_rabat()
            
            livreur = Livreur.objects.create(
                user=user,
                vehicle_info=random.choice(vehicles),
                is_available=random.choice([True, True, True, False]),  # 75% available
                current_lat=lat if random.choice([True, False]) else None,
                current_long=lng if random.choice([True, False]) else None
            )
            livreurs.append(livreur)
        
        self.stdout.write(f'Created {len(livreurs)} driver profiles')
        return livreurs

    def create_commandes(self, clients, livreurs, count):
        """Create Commande orders"""
        commandes = []
        
        statuts = ['En attente', 'En cours', 'Livré', 'Annulé']
        weights = ['0.5 kg', '1 kg', '2 kg', '3 kg', '5 kg', '10 kg']
        dimensions = ['Petit', 'Moyen', 'Grand', 'Standard', 'XL']
        
        for i in range(count):
            client = random.choice(clients)
            livreur_user = random.choice(livreurs).user if random.choice([True, False, False]) else None
            
            # Generate delivery coordinates
            lat, lng = self.generate_coordinates_rabat()
            
            # Generate tracking ID
            tracking_id = f"RAB{random.randint(100000, 999999)}"
            
            # Determine status and dates
            statut = random.choice(statuts)
            date_creation = datetime.now() - timedelta(days=random.randint(0, 30))
            
            date_livraison = None
            if statut == 'Livré':
                date_livraison = (date_creation + timedelta(days=random.randint(1, 5))).date()
            
            commande = Commande.objects.create(
                tracking_id=tracking_id,
                client_name=client.full_name,
                client_phone=client.phone_number,
                adresse_text=self.generate_rabat_address(),
                latitude=lat,
                longitude=lng,
                poids=random.choice(weights),
                dimensions=random.choice(dimensions),
                est_fragile=random.choice([True, False, False, False]),  # 25% fragile
                notes=random.choice([
                    'Appeler avant livraison',
                    'Fragile - manipuler avec précaution',
                    'Livrer en matinée',
                    'Interphone au nom de Mohamed',
                    None, None  # 30% have notes
                ]),
                montant=round(random.uniform(50, 500), 2),
                statut=statut,
                date_creation=date_creation,
                date_livraison=date_livraison,
                ordre_tournee=random.randint(1, 10) if livreur_user else 0,
                livreur=livreur_user
            )
            commandes.append(commande)
        
        self.stdout.write(f'Created {len(commandes)} orders')
        return commandes

    def create_notifications(self, users, commandes):
        """Create Notification objects"""
        notifications = []
        
        notification_types = [
            'order_assigned', 'order_picked_up', 'order_delivered', 
            'order_cancelled', 'status_change', 'INFO'
        ]
        
        titles = {
            'order_assigned': 'Nouvelle commande assignée',
            'order_picked_up': 'Commande prise en charge',
            'order_delivered': 'Commande livrée',
            'order_cancelled': 'Commande annulée',
            'status_change': 'Changement de statut',
            'INFO': 'Information'
        }
        
        messages = {
            'order_assigned': 'Une nouvelle commande vous a été assignée.',
            'order_picked_up': 'Votre commande a été prise en charge.',
            'order_delivered': 'Votre commande a été livrée avec succès.',
            'order_cancelled': 'Votre commande a été annulée.',
            'status_change': 'Le statut de votre commande a changé.',
            'INFO': 'Information importante concernant votre commande.'
        }
        
        for i in range(30):
            user = random.choice(users)
            commande = random.choice(commandes) if random.choice([True, False]) else None
            notif_type = random.choice(notification_types)
            
            created_at = datetime.now() - timedelta(hours=random.randint(1, 72))
            
            notification = Notification.objects.create(
                user=user,
                notification_type=notif_type,
                title=titles[notif_type],
                message=messages[notif_type],
                commande=commande,
                is_read=random.choice([True, False, False]),  # 33% read
                created_at=created_at
            )
            notifications.append(notification)
        
        self.stdout.write(f'Created {len(notifications)} notifications')
        return notifications
