from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

from .helpers import generate_slug

class Note(models.Model):
  """ Represents an individual note. """

  id = models.SlugField(max_length=settings.MAX_SLUG_LENGTH, primary_key=True)
  title = models.CharField(max_length=256, default='')
  content = models.TextField(blank=True, default='')
  notebook = models.ForeignKey('Notebook', on_delete=models.CASCADE)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
  date_created = models.DateField(auto_now_add=True)
  date_modified = models.DateField(auto_now=True)
  
  def save(self, *args, **kwargs):
    self.id = generate_slug(self, settings.MAX_SLUG_LENGTH)
    super(Note, self).save(*args, **kwargs)
  
  def __str__(self):
    return self.title
  
  class Meta:
    ordering = [ '-date_modified', '-date_created', 'title' ]

class Notebook(models.Model):
  """ A collection of individual notes. """
  
  id = models.SlugField(max_length=settings.MAX_SLUG_LENGTH, primary_key=True)
  name = models.CharField(max_length=64, default='')
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
  date_created = models.DateField(auto_now_add=True)
  date_modified = models.DateField(auto_now=True)

  def save(self, *args, **kwargs):
    self.id = generate_slug(self, settings.MAX_SLUG_LENGTH)
    super(Notebook, self).save(*args, **kwargs)

  def __str__(self):
    return self.title
  
  class Meta:
    ordering = [ '-date_modified', '-date_created', 'name' ]