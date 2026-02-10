from django.contrib import admin
from .models import Commande, Livreur
from authentication.models import User

@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    # On s'assure que le champ est bien présent dans l'affichage
    fields = ('livreur', 'client_name', 'client_phone', 'adresse_text', 'latitude', 'longitude', 'poids', 'dimensions', 'est_fragile','montant','statut', 'notes')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "livreur":
            # On filtre par le rôle 'Livreur' (vérifie bien la majuscule !)
            kwargs["queryset"] = User.objects.filter(role='Livreur')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

# On enregistre aussi Livreur pour qu'il soit visible dans le menu de gauche
admin.site.register(Livreur)