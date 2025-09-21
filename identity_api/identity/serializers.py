from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Context, IdentityProfile, Attribute, AccessPolicy

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)
    
    


class ContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Context
        fields = "__all__"


class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = ["id", "profile", "key", "value", "is_sensitive"]

    def validate_profile(self, value):
        if not IdentityProfile.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Profile does not exist.")
        return value


class IdentityProfileSerializer(serializers.ModelSerializer):
    attributes = AttributeSerializer(many=True, read_only=True)

    class Meta:
        model = IdentityProfile
        fields = ['id', 'user', 'context', 'profile_name', 'description', 'attributes']
        read_only_fields = ['user']



class AccessPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessPolicy
        fields = "__all__"


# class AuditLogSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AuditLog
#         fields = "__all__"

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["id", "username", "email", "role"]
