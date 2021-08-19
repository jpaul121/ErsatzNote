from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from .models import AppUser

class AppUserSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(required=True)
  password = serializers.CharField(min_length=8, write_only=True)

  class Meta:
    model = AppUser
    extra_kwargs = { 'password': { 'write_only': True } }
    fields = [ 'email', 'password' ]
  
  def create(self, validated_data):
    password = validated_data['password']
    instance = self.Meta.model(**validated_data)

    if password is not None:
      instance.set_password(password)
    
    instance.save()
    
    return instance

class AppTokenObtainPairSerializer(TokenObtainPairSerializer):

  @classmethod
  def get_token(cls, user):
    token = super().get_token(user)

    token['user'] = user.email

    return token