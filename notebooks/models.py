from django.db import models
from django.contrib.auth.models import User
from jsonfield import JSONField
from django.conf import settings

from .helpers import generate_slug

class Note(models.Model):
  """ Represents an individual note. """

  id = models.SlugField(max_length=settings.MAX_SLUG_LENGTH, primary_key=True)
  title = JSONField(null=True)
  content = models.TextField(null=True)
  notebook = models.ForeignKey('Notebook', related_name='notes', on_delete=models.CASCADE, null=True, blank=True)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notes', on_delete=models.CASCADE, null=True, blank=True)
  date_created = models.DateField(auto_now_add=True)
  date_modified = models.DateField(auto_now=True)
  
  def save(self, *args, **kwargs):
    if not self.id:
      self.id = generate_slug(self, settings.MAX_SLUG_LENGTH)
    # Temporary expedients for the sake of development
    if not self.notebook:
      self.notebook = Notebook.objects.get(id='YyOzNhMFMPtN8HM')
    super(Note, self).save(*args, **kwargs)
  
  def __str__(self):
    return self.id
  
  class Meta:
    ordering = [ '-date_modified', '-date_created', ]

class Notebook(models.Model):
  """ A collection of individual notes. """
  
  id = models.SlugField(max_length=settings.MAX_SLUG_LENGTH, primary_key=True)
  name = models.CharField(max_length=64, default='')
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notebooks', on_delete=models.CASCADE)
  date_created = models.DateField(auto_now_add=True)
  date_modified = models.DateField(auto_now=True)

  def save(self, *args, **kwargs):
    if not self.id:
      self.id = generate_slug(self, settings.MAX_SLUG_LENGTH)
    super(Notebook, self).save(*args, **kwargs)

  def __str__(self):
    return self.name
  
  class Meta:
    ordering = [ '-date_modified', '-date_created', 'name' ]