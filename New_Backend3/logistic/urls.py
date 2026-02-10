from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from django.views.generic import RedirectView
from authentication.views import LogoutView
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
# Authentification JWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from logistics.views_admin import (
    AdminDashboardStatsView, 
    AdminUserViewSet, 
    AdminLivreurViewSet, 
    AdminCommandeViewSet
)

from logistics.views import (
    # ... your existing views
    NotificationListView,
    NotificationMarkAsReadView,
    NotificationMarkAllAsReadView,
    NotificationDeleteView,
    NotificationClearAllView,
)


# Documentation Swagger
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from authentication.views import ProfilePhotoView
from logistics.views import DriverAvailabilityView, UpdateDriverAvailabilityView
from logistics.views import CalendarView
from logistics.views_admin import (
    AdminDashboardStatsView,
    AdminUserViewSet,
    AdminLivreurViewSet,
    AdminCommandeViewSet
)
# On précise qu'on va chercher dans le dossier 'authentication'

from logistics.views_admin import (
    AdminDashboardStatsView,
    AdminUserViewSet,
    AdminLivreurViewSet,
    AdminCommandeViewSet
)
# Vos Vues (Logistics)
from logistics.views import CommandeViewSet, PublicTrackingView, DriverLocationView

# Vos Vues (Authentication) - ATTENTION : Doivent exister dans authentication/views.py
from authentication.views import TeamViewSet, UserProfileView
from authentication.views import ChangePasswordView

# --- Configuration Swagger ---
schema_view = get_schema_view(
   openapi.Info(
      title="Delivery API",
      default_version='v1',
      description="API de gestion de livraison pour React et Flutter",
      contact=openapi.Contact(email="admin@malivraison.com"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# --- Configuration du Routeur ---
router = DefaultRouter()
# Gestion des commandes (CRUD complet)
router.register(r'commandes', CommandeViewSet, basename='commande')
# Gestion de l'équipe (Livreurs/Managers)
router.register(r'equipe', TeamViewSet, basename='equipe')


router.register(r'admin/users', AdminUserViewSet, basename='admin-users')
router.register(r'admin/livreurs', AdminLivreurViewSet, basename='admin-livreurs')
router.register(r'admin/commandes', AdminCommandeViewSet, basename='admin-commandes')
# --- URLs Patterns ---
urlpatterns = [
    path('admin/', admin.site.urls),

    # 1. AUTHENTIFICATION (JWT)
    # Login : Renvoie Access Token + Refresh Token
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Refresh : Permet à Flutter de rester connecté sans redemander le mot de passe
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Profil : Récupérer ses propres infos (Nom, Role, Photo)
    path('api/auth/profile/', UserProfileView.as_view(), name='user_profile'),

    # 2. FEATURES SPÉCIFIQUES (Flutter/Public)
    # Mise à jour GPS (Livreur -> Serveur)
    path('api/driver/location/', DriverLocationView.as_view(), name='driver_location'),
    # Tracking public (Client -> Serveur) - Pas besoin de login
    path('api/track/<str:tracking_id>/', PublicTrackingView.as_view(), name='public_tracking'),

    # 3. API PRINCIPALE (Router)
    # Inclut /api/commandes/ et /api/equipe/
    path('api/', include(router.urls)),
    path('', RedirectView.as_view(url='swagger/', permanent=False)), #
    # 4. DOCUMENTATION
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('api/auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('api/auth/profile/photo/', ProfilePhotoView.as_view(), name='profile_photo'),
    path('api/driver/availability/', UpdateDriverAvailabilityView.as_view(), name='driver_availability'),
    path('api/commandes/calendar/', CalendarView.as_view(), name='calendar'),
    path('api/commandes/calendar/', CalendarView.as_view(), name='calendar'),
# Modifie la ligne 99 comme ceci :
    path('api/admin/dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('api', include(router.urls)),
    

    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:notification_id>/read/', NotificationMarkAsReadView.as_view(), name='notification-mark-read'),
    path('notifications/read-all/', NotificationMarkAllAsReadView.as_view(), name='notification-mark-all-read'),
    path('notifications/<int:notification_id>/delete/', NotificationDeleteView.as_view(), name='notification-delete'),
    path('notifications/clear/', NotificationClearAllView.as_view(), name='notification-clear-all'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)