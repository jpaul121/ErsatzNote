from django.contrib.auth.models import AbstractUser
from django.db import models

# Note: create user IDs so that they can change their emails
class ErsatzNoteUser(AbstractUser):
  email = models.EmailField(primary_key=True)