# core/permissions.py
from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """ Seul l'Admin peut gérer les comptes (Livreurs/Gestionnaires) [cite: 92] """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class IsGestionnaireOrAdmin(permissions.BasePermission):
    """ Admin et Gestionnaire peuvent créer/modifier les commandes [cite: 95] """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['ADMIN', 'GESTIONNAIRE']

class IsLivreur(permissions.BasePermission):
    """ Vérifie si l'utilisateur est un livreur """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'LIVREUR'