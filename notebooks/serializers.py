import json

from rest_framework import serializers

from .models import Note, Notebook, User

class NoteSerializer(serializers.ModelSerializer):
  note_id = serializers.SlugField(source='Note.id', read_only=True, required=False)
  title = serializers.JSONField(source='Note.title', required=False)
  content = serializers.JSONField(source='Note.content', required=False)
  notebook = serializers.PrimaryKeyRelatedField(read_only=True, required=False)

  date_modified = serializers.DateField(source='Note.date_modified', read_only=True, required=False)
  date_created = serializers.DateField(source='Note.date_created', read_only=True, required=False)

  def create(self, data):
    title = json.dumps(data['Note']['title'])
    content = json.dumps(data['Note']['content'])

    return Note.objects.create(**{ 'title': title, 'content': content })

  def update(self, instance, data):
    instance.title = json.dumps(data['Note']['title'])
    instance.content = json.dumps(data['Note']['content'])

    instance.save()

    return instance

  class Meta:
    model = Note
    fields = [ 'note_id', 'title', 'content', 'notebook', 'date_modified', 'date_created' ]

class NotebookSerializer(serializers.ModelSerializer):
  notebook_id = serializers.SlugField(source='id')
  notes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
  
  class Meta:
    model = Notebook
    fields = [ 'notebook_id', 'name', 'notes', 'date_modified', 'date_created' ]