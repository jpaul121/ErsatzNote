import json

from django.core.files.base import ContentFile
from rest_framework import serializers

from .models import Note, Notebook, User

class NoteSerializer(serializers.ModelSerializer):
  note_id = serializers.SlugField(source='id', read_only=True, required=False)
  title = serializers.JSONField(required=False)
  content = serializers.CharField(required=False)
  notebook = serializers.PrimaryKeyRelatedField(read_only=True, required=False)

  date_modified = serializers.DateField(read_only=True, required=False)
  date_created = serializers.DateField(read_only=True, required=False)

  def create(self, validated_data):
    print('notebooks/serializers.py,\n', 'line 17, validated_data\n', validated_data)

    title = json.dumps(validated_data['title'])

    response_data = {
      'title': title,
      'content': validated_data['content'],
    }

    return Note.objects.create(**response_data)

  def update(self, instance, validated_data):
    instance.title = json.dumps(validated_data['title'])
    instance.content = validated_data['content']

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