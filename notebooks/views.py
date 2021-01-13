from django.shortcuts import render
from rest_framework import viewsets

from .serializers import NotebookSerializer
from .models import Notebook

class NotebookView(viewsets.ModelViewSet):
  serializer_class = NotebookSerializer
  queryset = Notebook.objects.all()