from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AppUser

class AppUserAdmin(UserAdmin):
  model = AppUser
  ordering = ('email',)

admin.site.register(AppUser, AppUserAdmin)