import django_heroku
import dj_database_url
import os
import subprocess
import whitenoise

from corsheaders.defaults import default_headers
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.environ.get('SECRET_KEY')

ALLOWED_HOSTS = [ 'localhost' ]

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:8080',
    'http://localhost:5432',
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Vary',
]

ACCESS_CONTROL_RESPONSE_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:8000',
  'Vary': 'Origin',
}

REACT_APP_API_ENDPOINT = 'http://localhost:8000'

GUEST_USER_CREDENTIALS = {
    'EMAIL': os.environ.get('GUEST_EMAIL'),
    'PASSWORD': os.environ.get('GUEST_PASSWORD'),
}

COMPILE_TIME_SETTING = {
    'NODE_ENV': os.environ.get('NODE_ENV'),
}

PORT = os.environ.get('PORT')



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'frontend', 'static', 'frontend'),
)

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEBUG = True

if os.environ.get('NODE_ENV') == 'production':
    DEBUG = False

    REACT_APP_API_ENDPOINT = 'https://ersatznote.com/'

    ALLOWED_HOSTS = [ 'ersatznote.herokuapp.com', 'ersatznote.com' ]

    CORS_ORIGIN_WHITELIST = [
        'https://ersatznote.com',
        'https://ersatznote.herokuapp.com',
        'https://*.herokuapp.com',
    ]

    CSRF_TRUSTED_ORIGINS = [
        'https://ersatznote.com',
        'https://ersatznote.herokuapp.com',
        'https://*.herokuapp.com',
    ]

    ACCESS_CONTROL_RESPONSE_HEADERS = {
        'Access-Control-Allow-Origin': 'https://ersatznote.herokuapp.com',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, POST',
        'Vary': 'Origin',
    }



# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'authentication',
    'corsheaders',
    'rest_framework',
    'notebooks',
    'frontend',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'



# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DATABASE_NAME'),
        'USER': os.environ.get('DB_OWNER_USERNAME'),
        'PASSWORD': os.environ.get('DB_OWNER_PASSWORD'),
        'HOST': os.environ.get('DATABASE_URL'),
        'PORT': os.environ.get('DB_PORT'),
    }
}

if os.environ.get('NODE_ENV') == 'production':
    credentials = subprocess.check_output([
        '/bin/bash',
        '-c',
        'heroku config:get DATABASE_URL -a ersatznote',
    ], shell=True).decode('utf-8')

    DATABASES['default'] = dj_database_url.config(default=credentials, conn_max_age=600)



# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]



# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True



# Miscellaneous

MAX_SLUG_LENGTH = 15

APPEND_SLASH = True

AUTH_USER_MODEL = 'authentication.ErsatzNoteUser'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('JWT',),
    'USER_ID_FIELD': 'email',
    'USER_ID_CLAIM': 'login_email',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# Logging

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': ('%(asctime)s [%(process)d] [%(levelname)s] '
                       'funcname=%(message)s'),
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}

django_heroku.settings(locals(), logging=False, databases=False)