from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from notebooks import views

router = DefaultRouter()
router.register(r'notebooks', views.NotebookViewSet)

urlpatterns = [
    # notebook
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # frontend
    path('', include('frontend.urls')),
    path('notebooks/', include('frontend.urls')),
    path('notebooks/<slug:pk>/', include('frontend.urls')),
]