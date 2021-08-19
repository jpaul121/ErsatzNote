from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import AppUser
from notebooks.models import Notebook

@receiver(post_save, sender=AppUser)
def create_default_notebook(sender, instance, created, **kwargs):
  if created:
    Notebook.objects.create(
      user=instance,
      name='General Notes'
    )

post_save.connect(create_default_notebook, sender=AppUser)