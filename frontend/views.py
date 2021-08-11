import json
import os

from django.conf import settings
from django.shortcuts import render

def index(request, *args, **kwargs):
  print(request.headers)
  return render(request, 'index.html', context={
    "COMPILE_TIME_SETTING": json.dumps(settings.COMPILE_TIME_SETTING),
    "GUEST_USER_CREDENTIALS": json.dumps(settings.GUEST_USER_CREDENTIALS),
    "PORT": json.dumps(settings.PORT),
  })