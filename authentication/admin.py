from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import ErsatzNoteUser

class ErsatzNoteUserAdmin(UserAdmin):
  model = ErsatzNoteUser
  ordering = ('email',)

admin.site.register(ErsatzNoteUser, ErsatzNoteUserAdmin)