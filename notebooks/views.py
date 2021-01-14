from django.shortcuts import render
from rest_framework import viewsets

from .serializers import NoteSerializer, NotebookSerializer
from .models import Note, Notebook

class NoteView(viewsets.ModelViewSet):
  serializer_class = NoteSerializer
  queryset = Note.objects.all()

class NotebookView(viewsets.ModelViewSet):
  serializer_class = NotebookSerializer
  queryset = Notebook.objects.all()