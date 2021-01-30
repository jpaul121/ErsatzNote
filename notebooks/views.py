from rest_framework import viewsets

from .serializers import NoteSerializer, NotebookSerializer
from .models import Note, Notebook

class NoteViewSet(viewsets.ModelViewSet):
  queryset = Note.objects.all()
  serializer_class = NoteSerializer

class NotebookViewSet(viewsets.ModelViewSet):
  queryset = Notebook.objects.all()
  serializer_class = NotebookSerializer