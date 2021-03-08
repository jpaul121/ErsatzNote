from django.db import models
from django.contrib.auth.models import User
from jsonfield import JSONField
from django.conf import settings

from .helpers import generate_slug

class Note(models.Model):
  """ Represents an individual note. """

  id = models.SlugField(max_length=settings.MAX_SLUG_LENGTH, primary_key=True)
  title = JSONField(null=True, blank=True)
  content = JSONField(null=True, blank=True)
  notebook = models.ForeignKey('Notebook', related_name='notes', on_delete=models.CASCADE, null=True, blank=True)
  user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
  date_created = models.DateField(auto_now_add=True)
  date_modified = models.DateField(auto_now=True)
  
  def save(self, *args, **kwargs):
    if not self.id:
      self.id = generate_slug(self, settings.MAX_SLUG_LENGTH)
    # Temporary expedients for the sake of development
    if not self.notebook:
      self.notebook = Notebook.objects.get(id='X5POEuPFnvTVsnY')
    if not self.user:
      self.user = User.objects.get(id=1)
    super(Note, self).save(*args, **kwargs)
  
  def __str__(self):
    return self.id
  
  class Meta:
    ordering = [ '-date_modified', '-date_created', ]

class Notebook(models.Model):
  """ A collection of individual notes. """
  
  id = models.SlugField(max_length=settings.MAX_SLUG_LENGTH, primary_key=True)
  name = models.CharField(max_length=64, default='')
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  date_created = models.DateField(auto_now_add=True)
  date_modified = models.DateField(auto_now=True)

  def save(self, *args, **kwargs):
    if not self.id:
      self.id = generate_slug(self, settings.MAX_SLUG_LENGTH)
    super(Notebook, self).save(*args, **kwargs)

  # Note: this needs plaintext, so Slate outputs need to be converted
  # or this will throw an error. 
  def __str__(self):
    return self.name
  
  class Meta:
    ordering = [ '-date_modified', '-date_created', 'name' ]