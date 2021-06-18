from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from authentication.models import ErsatzNoteUser
from .models import Note, Notebook

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
  list_display = ('id', 'title', 'notebook', 'user', 'date_modified', 'date_created')
  fieldsets = [
    (None,                 {'fields': ['title', 'content']}),
    ('Ownership',          {'fields': ['notebook', 'user']}),
  ]

@admin.register(Notebook)
class NotebookAdmin(admin.ModelAdmin):
  list_display = ('id', 'name', 'user', 'date_modified', 'date_created')
  fieldsets = [
    (None,                 {'fields': ['name', 'user']}),
  ]