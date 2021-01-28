from django.urls import path

from . import views

urlpatterns = [
  path('notebooks/', views.index),
  path('', views.index),
]