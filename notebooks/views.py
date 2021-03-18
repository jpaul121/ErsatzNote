import json

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import NoteSerializer, NotebookSerializer
from .models import Note, Notebook

class NoteViewSet(viewsets.ModelViewSet):
  queryset = Note.objects.all()
  serializer_class = NoteSerializer

  def retrieve(self, request, *args, **kwargs):
    instance = self.get_object()
    serializer = NoteSerializer(instance)

    print('notebooks/views.py\n', 'line 18, serializer.data\n', serializer.data)

    title = json.loads(serializer.data['title'])
    
    with instance.content.open('r') as f:
      content = f.readlines()
      f.close()

    response_data = {
      'note_id': serializer.data['note_id'],
      'title': title,
      'content': content,
      'notebook': serializer.data['notebook'],
      'date_modified': serializer.data['date_modified'],
      'date_created': serializer.data['date_created'],
    }

    return Response(response_data)
  
  def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(self.get_queryset())

    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)

    serializer = self.get_serializer(queryset, many=True)
    print('notebooks/views.py\n', 'line 43\n', serializer.data)
    return Response(serializer.data)





class NotebookViewSet(viewsets.ModelViewSet):
  queryset = Notebook.objects.all()
  serializer_class = NotebookSerializer