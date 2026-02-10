from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'phone', 
            'profile_photo_url', 'vehicle_info', 'is_available', 
            'current_lat', 'current_long'
        ]
        read_only_fields = ['id']
    def get_profile_photo_url(self, obj):
        
            if obj.profile_photo:
                request = self.context.get('request')
                if request:
                    # Return absolute URL
                    return request.build_absolute_uri(obj.profile_photo.url)
                else:
                    # Fallback to relative URL
                    return obj.profile_photo.url
            return None

# Note : On n'ajoute PAS de LivreurSerializer ici car 
# tout est déjà géré par UserSerializer grâce à ton architecture.