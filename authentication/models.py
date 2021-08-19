from django.contrib.auth.models import AbstractUser
from django.db import models

# Note: create user IDs so that they can change their emails
class AppUser(AbstractUser):
  email = models.EmailField(primary_key=True)
  username = None

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = []

  def __str__(self):
    return self.email