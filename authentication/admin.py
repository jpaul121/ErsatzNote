from django.contrib import admin
from .models import ErsatzNoteUser

class ErsatzNoteUserAdmin(admin.ModelAdmin):
  model = ErsatzNoteUser

admin.site.register(ErsatzNoteUser, ErsatzNoteUserAdmin)