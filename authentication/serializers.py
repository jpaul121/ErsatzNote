from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import ErsatzNoteUser

class ErsatzNoteUserSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(required=True)
  password = serializers.CharField(min_length=8, write_only=True)

  class Meta:
    model = ErsatzNoteUser
    extra_kwargs = { 'password': { 'write_only': True } }
    fields = [ 'email', 'password' ]
  
  def create(self, validated_data):
    password = validated_data['password']
    instance = self.Meta.model(**validated_data)

    if password is not None:
      instance.set_password(password)
    
    instance.save()
    
    return instance

class ErsatzNoteTokenObtainPairSerializer(TokenObtainPairSerializer):

  @classmethod
  def get_token(cls, user):
    token = super(ErsatzNoteTokenObtainPairSerializer, cls).get_token(user)

    token['user'] = user.email

    return token