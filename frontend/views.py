from django.shortcuts import render

def index(request, pk):
  return render(request, 'index.html')