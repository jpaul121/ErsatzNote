from rest_framework import serializers

from .models import Note, Notebook

class NoteSerializer(serializers.ModelSerializer):
  note_id = serializers.SlugField(source='id')

  class Meta:
    model = Note
    fields = [ 'note_id', 'title', 'content', 'date_modified', 'date_created' ]

class NotebookSerializer(serializers.ModelSerializer):
  notebook_id = serializers.SlugField(source='id')
  notes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
  
  class Meta:
    model = Notebook
    fields = [ 'notebook_id', 'name', 'notes', 'date_modified', 'date_created' ]
    # depth = 1
    # extra_kwargs = {
    #   'notebook_id': { 'lookup_field': 'notebook_id' }
    # }