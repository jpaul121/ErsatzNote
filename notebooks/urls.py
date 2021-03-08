from notebooks.views import NoteViewSet, NotebookViewSet
from rest_framework import renderers

notebook_list = NotebookViewSet.as_view({
  'get': 'list',
  'post': 'create',
})

notebook_detail = NotebookViewSet.as_view({
  'get': 'retrieve',
  'put': 'update',
  'patch': 'partial_update',
  'delete': 'destroy',
})

note_detail = NoteViewSet.as_view({
  'get': 'retrieve',
  'post': 'create',
  'put': 'update',
})