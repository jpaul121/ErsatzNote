from rest_framework import serializers

from .models import Note, Notebook

class NoteSerializer(serializers.ModelSerializer):
  class Meta:
    model = Note
    fields = [ 'title', 'content', 'date_modified', 'date_created' ]

class NotebookSerializer(serializers.ModelSerializer):
  notes = NoteSerializer(many=True)
  
  class Meta:
    model = Notebook
    fields = [ 'id', 'name', 'date_modified', 'date_created' ]