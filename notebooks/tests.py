from django.test import TestCase
from django.contrib.auth.models import User

from .models import Note, Notebook

class NoteTestCase(TestCase):
  def setUp(self):
    self.user = User.objects.create(username='test_user')
    self.notebook = Notebook.objects.create(name='Notebook 1', user=self.user)
  
  def test_can_create_simple_note(self):
    test_note = Note.objects.create(notebook=self.notebook, user=self.user)

    self.assertEqual(test_note.title, '')
    self.assertEqual(test_note.content, '')
    self.assertEqual(test_note.notebook, self.notebook)
    self.assertEqual(test_note.user, self.user)