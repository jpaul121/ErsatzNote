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

  def create(self, request, *args, **kwargs):
    serializer = NoteSerializer(data=request.data, context={ 'request': request })
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)
    headers = self.get_success_headers(serializer.data)

    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
  
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

  def update(self, request, *args, **kwargs):
    partial = kwargs.pop('partial', False)
    instance = self.get_object()
    serializer = NoteSerializer(
      instance,
      data=request.data,
      partial=partial,
      context={ 'request': request }
    )
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)

    if getattr(instance, '_prefetched_objects_cache', None):
      instance._prefetched_objects_cache = {}
    
    return Response(serializer.data)

class NotebookViewSet(viewsets.ModelViewSet):
  serializer_class = NotebookSerializer

  def get_queryset(self):
    return self.request.user.notebooks.all()

  def create(self, request, *args, **kwargs):
    serializer = NotebookSerializer(data=request.data, context={ 'request': request })
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)
    headers = self.get_success_headers(serializer.data)

    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)