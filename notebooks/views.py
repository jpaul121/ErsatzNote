import json

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import NoteSerializer, NotebookSerializer
from .models import Note, Notebook

class NoteViewSet(viewsets.ModelViewSet):
  serializer_class = NoteSerializer
  
  def get_queryset(self):
    return self.request.user.notes.all()
  
  def retrieve(self, request, *args, **kwargs):
    instance = self.get_object()
    serializer = NoteSerializer(instance)

    title = json.loads(serializer.data['title'])

    response_data = {
      'note_id': serializer.data['note_id'],
      'title': title,
      'content': serializer.data['content'],
      'notebook': serializer.data['notebook'],
      'date_modified': serializer.data['date_modified'],
      'date_created': serializer.data['date_created'],
    }

    return Response(response_data)

class NotebookViewSet(viewsets.ModelViewSet):
  serializer_class = NotebookSerializer

  def get_queryset(self):
    return self.request.user.notebooks.all()