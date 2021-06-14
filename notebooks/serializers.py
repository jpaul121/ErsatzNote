import json

from rest_framework import serializers

from authentication.models import ErsatzNoteUser
from .models import Note, Notebook

class NoteSerializer(serializers.ModelSerializer):
  note_id = serializers.SlugField(source='id', read_only=True, required=False)
  title = serializers.JSONField(required=False)
  content = serializers.CharField(required=False)
  notebook = serializers.PrimaryKeyRelatedField(read_only=True, required=False)

  date_modified = serializers.DateField(read_only=True, required=False)
  date_created = serializers.DateField(read_only=True, required=False)

  def create(self, validated_data):
    title = json.dumps(validated_data['title'])

    # Workaround to fix a currently unpatched bug in Slate
    # that occurs when an editor's contents begin with a list
    content = validated_data['content']
    if content.startswith('<ul') or content.startswith('<ol'):
      content = '<p></p>' + content

    response_data = {
      'title': title,
      'content': content,
    }

    return Note.objects.create(**response_data)

  def update(self, instance, validated_data):
    instance.title = json.dumps(validated_data['title'])

    # See the above comment in the 'create' method
    content = validated_data['content']
    if content.startswith('<ul') or content.startswith('<ol'):
      content = '<p></p>' + content
    
    instance.content = content

    instance.save()

    return instance

  class Meta:
    model = Note
    fields = [ 'note_id', 'title', 'content', 'notebook', 'date_modified', 'date_created' ]

class NotebookSerializer(serializers.ModelSerializer):
  notebook_id = serializers.SlugField(source='id', read_only=True, required=False)
  name = serializers.CharField(max_length=64, default='')
  notes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

  def create(self, validated_data):
    return Notebook.objects.create(
      user=ErsatzNoteUser.objects.get(email=self.context['request'].user),
      **validated_data
    )
  
  class Meta:
    model = Notebook
    fields = [ 'notebook_id', 'name', 'notes', 'date_modified', 'date_created' ]