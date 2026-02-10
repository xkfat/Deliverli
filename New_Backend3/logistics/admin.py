from django.contrib import admin
from .models import Commande, Livreur
from django.contrib.auth import get_user_model

User = get_user_model()

@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    # Ensure tracking_id is read-only (since it's auto-generated)
    readonly_fields = ('tracking_id', 'date_creation')
    
    list_display = ('tracking_id', 'client_name', 'livreur', 'statut', 'date_livraison', 'date_creation')
    list_filter = ('statut', 'date_creation')
    search_fields = ('tracking_id', 'client_name', 'client_phone')

    fields = (
        'tracking_id', # Added to see it (read-only)
        'livreur', 
        'client_name', 
        'client_phone', 
        'adresse_text', 
        'latitude', 
        'longitude', 
        'poids', 
        'dimensions', 
        'est_fragile',
        'montant',
        'statut', 
        'date_livraison', 'notes'
    )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "livreur":
            # ✅ FIX: Use 'role__iexact' to match 'LIVREUR', 'Livreur', or 'livreur'
            kwargs["queryset"] = User.objects.filter(role__iexact='livreur')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

# Register Livreur profile to see vehicle info
@admin.register(Livreur)
class LivreurAdmin(admin.ModelAdmin):
    list_display = ('user', 'vehicle_info', 'is_available', 'current_lat', 'current_long')