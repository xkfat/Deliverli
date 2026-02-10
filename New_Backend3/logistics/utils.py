from .models import Notification

def create_notification(user, notification_type, title, message, commande=None):
    """
    Helper function to create notifications
    
    Args:
        user: User object to receive the notification
        notification_type: Type of notification (from NOTIFICATION_TYPES)
        title: Notification title
        message: Notification message
        commande: Optional commande object
    
    Returns:
        Notification object
    """
    notification = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        commande=commande
    )
    return notification


def notify_driver_assignment(driver, commande):
    """Notify driver when assigned a new order"""
    return create_notification(
        user=driver.user,
        notification_type='order_assigned',
        title='Nouvelle commande assignée',
        message=f'Vous avez une nouvelle livraison: {commande.tracking_id} pour {commande.client_name}',
        commande=commande
    )


def notify_client_status_change(commande):
    """Notify client when order status changes"""
    # You can add client user relationship later
    # For now, we'll just create the notification logic
    
    status_messages = {
        'En cours': {
            'title': 'Commande prise en charge',
            'message': f'Votre colis {commande.tracking_id} a été pris en charge par le livreur',
            'type': 'order_picked_up'
        },
        'Livré': {
            'title': 'Commande livrée',
            'message': f'Votre colis {commande.tracking_id} a été livré avec succès',
            'type': 'order_delivered'
        },
        'Annulé': {
            'title': 'Commande annulée',
            'message': f'Votre colis {commande.tracking_id} a été annulé',
            'type': 'order_cancelled'
        },
    }
    
    if commande.statut in status_messages:
        info = status_messages[commande.statut]
        
        # If you have client user, uncomment this:
        # if commande.client_user:
        #     return create_notification(
        #         user=commande.client_user,
        #         notification_type=info['type'],
        #         title=info['title'],
        #         message=info['message'],
        #         commande=commande
        #     )
        
        # For now, just log it
        print(f"📧 Would send notification: {info['title']} - {info['message']}")
