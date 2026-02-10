#!/usr/bin/env python3
"""
Data Generator for Logistics/Delivery Backend in Rabat
Generates realistic mock data matching your existing Django models
"""

import random
import json
from datetime import datetime, timedelta
import uuid


def generate_phone():
    """Generate Moroccan phone number"""
    return f"+212{random.choice(['6', '7'])}{random.randint(10000000, 99999999)}"


def generate_moroccan_name():
    """Generate Moroccan names"""
    first_names = [
        'Ahmed', 'Mohammed', 'Fatima', 'Aicha', 'Youssef', 'Khadija',
        'Hassan', 'Latifa', 'Omar', 'Nadia', 'Rachid', 'Samira',
        'Karim', 'Zineb', 'Abdelkader', 'Malika', 'Said', 'Houda',
        'Mustapha', 'Leila', 'Khalid', 'Amina', 'Brahim', 'Salma'
    ]
    
    last_names = [
        'Alami', 'Benali', 'Cherkaoui', 'Fassi', 'Tazi', 'Benjelloun',
        'El Alaoui', 'Chakir', 'Berrada', 'Filali', 'Lahlou', 'Sefrioui',
        'Benslimane', 'Kettani', 'Bernoussi', 'Zniber', 'El Guermai'
    ]
    
    return random.choice(first_names), random.choice(last_names)


def generate_rabat_address():
    """Generate realistic Rabat addresses"""
    neighborhoods = [
        'Agdal', 'Hassan', 'Hay Riad', 'Souissi', 'Aviation', 'Ocean',
        'Medina', 'Mechouar', 'Youssoufia', 'Akkari', 'Diour Jamaa',
        'Kamra', 'Madinat Al Irfane', 'Nahda', 'Massira', 'Hay Karima'
    ]
    
    streets = [
        'Avenue Mohamed VI', 'Rue Allal El Fassi', 'Boulevard Hassan II',
        'Avenue des Nations Unies', 'Rue Ibn Sina', 'Avenue Al Marsa',
        'Rue Oued Fes', 'Boulevard Chellah', 'Avenue Mehdi Ben Barka',
        'Rue Patrice Lumumba'
    ]
    
    neighborhood = random.choice(neighborhoods)
    street = random.choice(streets)
    number = random.randint(1, 200)
    
    return f"{number} {street}, {neighborhood}, Rabat"


def generate_coordinates_rabat():
    """Generate coordinates within Rabat bounds"""
    # Rabat coordinates bounds
    lat_min, lat_max = 33.95, 34.05
    lng_min, lng_max = -6.87, -6.80
    
    lat = round(random.uniform(lat_min, lat_max), 6)
    lng = round(random.uniform(lng_min, lng_max), 6)
    
    return lat, lng


def create_users(count=30):
    """Create users (clients, livreurs, gestionnaires) matching Django User model"""
    users = []
    
    for i in range(count):
        first_name, last_name = generate_moroccan_name()
        username = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}"
        email = f"{username}@{random.choice(['gmail.com', 'menara.ma', 'hotmail.com'])}"
        
        # Assign roles
        if i < 5:
            role = 'gestionnaire'
        elif i < 15:
            role = 'livreur'
        else:
            role = 'client'
        
        user_data = {
            'id': i + 1,
            'username': username,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'is_active': True,
            'is_staff': role == 'gestionnaire',
            'is_superuser': False,
            'date_joined': (datetime.now() - timedelta(days=random.randint(30, 365))).isoformat(),
            'role': role  # Custom field for your app
        }
        users.append(user_data)
    
    return users


def create_clients(users):
    """Create Client profiles matching your Client model"""
    clients = []
    client_users = [u for u in users if u['role'] == 'client']
    
    for user in client_users:
        lat, lng = generate_coordinates_rabat()
        
        client_data = {
            'id': len(clients) + 1,
            'user': user['id'],
            'full_name': f"{user['first_name']} {user['last_name']}",
            'phone_number': generate_phone(),
            'address_text': generate_rabat_address(),
            'address_lat': lat,
            'address_long': lng
        }
        clients.append(client_data)
    
    return clients


def create_livreurs(users):
    """Create Livreur profiles matching your Livreur model"""
    livreurs = []
    livreur_users = [u for u in users if u['role'] == 'livreur']
    
    vehicles = [
        'Moto Yamaha 125cc', 'Scooter Honda 150cc', 'Moto Suzuki 200cc',
        'Vélo électrique', 'Scooter Piaggio', 'Moto Kawasaki 250cc'
    ]
    
    for user in livreur_users:
        lat, lng = generate_coordinates_rabat()
        
        livreur_data = {
            'id': len(livreurs) + 1,
            'user': user['id'],
            'vehicle_info': random.choice(vehicles),
            'is_available': random.choice([True, True, True, False]),  # 75% available
            'current_lat': lat if random.choice([True, False]) else None,
            'current_long': lng if random.choice([True, False]) else None
        }
        livreurs.append(livreur_data)
    
    return livreurs


def create_commandes(clients, livreurs, count=50):
    """Create Commande orders matching your Commande model"""
    commandes = []
    
    statuts = ['En attente', 'En cours', 'Livré', 'Annulé']
    weights = ['0.5 kg', '1 kg', '2 kg', '3 kg', '5 kg', '10 kg']
    dimensions = ['Petit', 'Moyen', 'Grand', 'Standard', 'XL']
    
    for i in range(count):
        client = random.choice(clients)
        livreur = random.choice(livreurs) if random.choice([True, False, False]) else None  # 33% assigned
        
        # Generate delivery address (different from client address)
        lat, lng = generate_coordinates_rabat()
        
        # Generate tracking ID
        tracking_id = f"RAB{random.randint(100000, 999999)}"
        
        # Determine status and dates
        statut = random.choice(statuts)
        date_creation = datetime.now() - timedelta(days=random.randint(0, 30))
        
        date_livraison = None
        if statut == 'Livré':
            date_livraison = (date_creation + timedelta(days=random.randint(1, 5))).date().isoformat()
        
        commande_data = {
            'id': i + 1,
            'tracking_id': tracking_id,
            'client_name': client['full_name'],
            'client_phone': client['phone_number'],
            'adresse_text': generate_rabat_address(),
            'latitude': lat,
            'longitude': lng,
            'poids': random.choice(weights),
            'dimensions': random.choice(dimensions),
            'est_fragile': random.choice([True, False, False, False]),  # 25% fragile
            'notes': random.choice([
                'Appeler avant livraison', 'Fragile - manipuler avec précaution',
                'Livrer en matinée', 'Interphone au nom de Mohamed',
                'Étage 3 sans ascenseur', None, None  # 30% have notes
            ]),
            'montant': round(random.uniform(50, 500), 2),
            'statut': statut,
            'date_creation': date_creation.isoformat(),
            'date_livraison': date_livraison,
            'ordre_tournee': random.randint(1, 10) if livreur else 0,
            'livreur': livreur['id'] if livreur else None,
            'livreur_name': f"{livreur['user']} - {livreur['vehicle_info']}" if livreur else None
        }
        commandes.append(commande_data)
    
    return commandes


def create_notifications(users, commandes, count=30):
    """Create Notification objects matching your Notification model"""
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
    
    for i in range(count):
        user = random.choice(users)
        commande = random.choice(commandes) if random.choice([True, False]) else None
        notif_type = random.choice(notification_types)
        
        notification_data = {
            'id': i + 1,
            'user': user['id'],
            'notification_type': notif_type,
            'title': titles[notif_type],
            'message': messages[notif_type],
            'commande': commande['id'] if commande else None,
            'is_read': random.choice([True, False, False]),  # 33% read
            'created_at': (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat()
        }
        notifications.append(notification_data)
    
    return notifications


def main():
    """Generate all data for Rabat logistics app"""
    print("🚚 Generating logistics data for Rabat...")
    
    # Generate data matching your Django models
    users = create_users(30)
    clients = create_clients(users)
    livreurs = create_livreurs(users)
    commandes = create_commandes(clients, livreurs, 50)
    notifications = create_notifications(users, commandes, 30)
    
    # Statistics
    total_orders = len(commandes)
    delivered_orders = len([c for c in commandes if c['statut'] == 'Livré'])
    pending_orders = len([c for c in commandes if c['statut'] == 'En attente'])
    in_progress_orders = len([c for c in commandes if c['statut'] == 'En cours'])
    
    # Prepare export data
    export_data = {
        'users': users,
        'clients': clients,
        'livreurs': livreurs,
        'commandes': commandes,
        'notifications': notifications,
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'city': 'Rabat',
            'total_users': len(users),
            'total_clients': len(clients),
            'total_livreurs': len(livreurs),
            'total_commandes': total_orders,
            'total_notifications': len(notifications),
            'order_stats': {
                'delivered': delivered_orders,
                'pending': pending_orders,
                'in_progress': in_progress_orders,
                'cancelled': total_orders - delivered_orders - pending_orders - in_progress_orders
            }
        },
        'rabat_info': {
            'neighborhoods': [
                'Agdal', 'Hassan', 'Hay Riad', 'Souissi', 'Aviation', 'Ocean',
                'Medina', 'Mechouar', 'Youssoufia', 'Akkari'
            ],
            'coordinates_bounds': {
                'lat_min': 33.95,
                'lat_max': 34.05,
                'lng_min': -6.87,
                'lng_max': -6.80
            }
        }
    }
    
    # Save to JSON file
    with open('rabat_logistics_data.json', 'w', encoding='utf-8') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    print("✅ Generated rabat_logistics_data.json successfully!")
    print(f"📊 Data summary:")
    print(f"   👥 {len(users)} users (5 gestionnaires, 10 livreurs, 15 clients)")
    print(f"   📱 {len(clients)} client profiles")
    print(f"   🛵 {len(livreurs)} delivery drivers")
    print(f"   📦 {total_orders} orders ({delivered_orders} delivered, {pending_orders} pending)")
    print(f"   🔔 {len(notifications)} notifications")
    print(f"   📍 All addresses in Rabat neighborhoods")
    
    return export_data


if __name__ == '__main__':
    main()
