from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from notebooks import views
from .settings import BASENAME

router = DefaultRouter()
router.register(r'notebooks', views.NotebookViewSet, BASENAME)
router.register(r'notes', views.NoteViewSet, BASENAME)

urlpatterns = [
    # notebook
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # frontend
    path('', include('frontend.urls')),
    path('notebooks/', include('frontend.urls')),
    path('notebooks/<slug:notebook_pk>/', include('frontend.urls')),
    path('notebooks/<slug:notebook_pk>/notes/<slug:note_pk>/', include('frontend.urls')),
    path('new-note/', include('frontend.urls')),
]