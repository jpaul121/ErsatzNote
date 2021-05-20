from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import ErsatzNoteUserSerializer, ErsatzNoteTokenObtainPairSerializer

class ErsatzNoteUserCreate(APIView):
  authentication_classes = []
  permission_classes = (permissions.AllowAny,)

  def post(self, request, format='json'):
    serializer = ErsatzNoteUserSerializer(data=request.data)

    if serializer.is_valid():
      user = serializer.save()

      if user:
        json = serializer.data

        return Response(json, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ObtainRefreshToken(TokenObtainPairView):
  authentication_classes = []
  permission_classes = (permissions.AllowAny,)
  serializer_class = ErsatzNoteTokenObtainPairSerializer