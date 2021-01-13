from django.contrib import admin

from .models import Note, Notebook

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
  list_display = ('id', 'title', 'notebook', 'user', 'date_modified', 'date_created')
  fieldsets = [
    (None,                 {'fields': ['title', 'content']}),
  ]

@admin.register(Notebook)
class NotebookAdmin(admin.ModelAdmin):
  list_display = ('id', 'name', 'user', 'date_modified', 'date_created')
  fieldsets = [
    (None,                 {'fields': ['name', 'content']}),
  ]