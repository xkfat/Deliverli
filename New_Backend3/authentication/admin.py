from django.contrib import admin

from .models import User  # Vérifie que ton modèle s'appelle bien User

# Cette ligne permet d'afficher "Users" dans ton navigateur
admin.site.register(User)
# Register your models here.
