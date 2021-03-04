from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import NoteSerializer, NotebookSerializer
from .models import Note, Notebook

class NoteViewSet(viewsets.ModelViewSet):
  queryset = Note.objects.all()
  serializer_class = NoteSerializer

  @action(detail=True, methods=['put'])
  def edit_note(self, request, pk):
    note = Note.objects.get(id=pk)
    note.title = request.data.title
    note.content = request.data.content
    
    note.save()



class NotebookViewSet(viewsets.ModelViewSet):
  queryset = Notebook.objects.all()
  serializer_class = NotebookSerializer