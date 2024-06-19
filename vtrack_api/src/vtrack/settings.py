"""
Django settings for vtrack project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from ast import literal_eval
from pathlib import Path
import configparser
import os
import json

# Environment from Environment Variable
ENVIRONMENT_VARIABLE = "VTRACK_ENV"
ENVIRONMENT = os.environ.setdefault(ENVIRONMENT_VARIABLE, "development")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
RESOURCE_DIR = BASE_DIR.parent / "resources"
LOG_DIR = BASE_DIR.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)
MEDIA_ROOT = BASE_DIR.parent / "media"
MEDIA_ROOT.mkdir(exist_ok=True)
STATIC_ROOT = BASE_DIR.parent / "static"
STATIC_ROOT.mkdir(exist_ok=True)


# Environment file

ENVIRONMENT_FILE = RESOURCE_DIR / "{}.ini".format(ENVIRONMENT)
if not ENVIRONMENT_FILE.exists():
    raise FileNotFoundError(ENVIRONMENT_FILE)

CNF = configparser.ConfigParser()
CNF.read(ENVIRONMENT_FILE)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = CNF.get("DEFAULT", "SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = CNF.getboolean("DEFAULT", "DEBUG")

ALLOWED_HOSTS = literal_eval(CNF.get("DEFAULT", "ALLOWED_HOSTS"))


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party Apps
    "rest_framework",
    "rest_framework.authtoken",
    "django_filters",
    "guardian",
    # Custom Apps
    "config",
    "user",
    "visitor",
] + literal_eval(CNF.get("DEFAULT", "INSTALLED_APPS"))

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # "config.middlewares.ErrorLoggingMiddleware"
]

ROOT_URLCONF = "vtrack.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "vtrack.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {key.upper(): value for key, value in CNF.items("DEFAULT DATABASE")}
}


# Authentication backends
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "guardian.backends.ObjectPermissionBackend",
]


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "/static/"
MEDIA_URL = "media/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Default data upload max memory size
# https://docs.djangoproject.com/en/3.2/ref/settings/#data-upload-max-memory-size

DATA_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024 * 75

# Default file upload max memory size
# https://docs.djangoproject.com/en/3.2/ref/settings/#file-upload-max-memory-size

FILE_UPLOAD_MAX_MEMORY_SIZE = DATA_UPLOAD_MAX_MEMORY_SIZE

# Default X-Forwarded Host
# https://docs.djangoproject.com/en/3.2/ref/settings/#use-x-forwarded-host

USE_X_FORWARDED_HOST = True

# Default X-Forwarded PORT
# https://docs.djangoproject.com/en/3.2/ref/settings/#use-x-forwarded-port

USE_X_FORWARDED_PORT = True

# Forward http to https
# https://docs.djangoproject.com/en/3.2/ref/settings/#secure-proxy-ssl-header

SECURE_PROXY_SSL_HEADER = literal_eval(CNF.get("DEFAULT", "SECURE_PROXY_SSL_HEADER"))

# Logging
# https://docs.djangoproject.com/en/3.2/topics/logging/

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "vtrack_handler": {
            "level": "DEBUG",
            "class": "logging.handlers.TimedRotatingFileHandler",
            "formatter": "verbose",
            "filename": LOG_DIR / "debug.log",
            "when": "midnight",
            "interval": 1,
            "backupCount": 7,
        },
    },
    "loggers": {
        "vtrack_logger": {
            "handlers": ["vtrack_handler"],
            "level": "DEBUG",
        }
    },
}

CSRF_TRUSTED_ORIGINS = ['127.0.0.1:8181']


# REST Framework
# https://www.django-rest-framework.org/api-guide/settings/

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication"
    ],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "PAGE_SIZE": None,
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
}

# Swagger Settings (OpenAPI 2.0)
# https://drf-yasg.readthedocs.io/en/stable/settings.html

SWAGGER_SETTINGS = {
    "DEFAULT_INFO": "vtrack.urls.info",
    "LOGIN_URL": "/admin",
    "SECURITY_DEFINITIONS": {
        "Token": {"type": "apiKey", "name": "Authorization", "in": "header"}
    },
}

# Sending email: SMTP
# https://docs.djangoproject.com/en/3.2/topics/email/#smtp-backend

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = CNF.get("DEFAULT", "EMAIL_HOST")
EMAIL_PORT = CNF.get("DEFAULT", "EMAIL_PORT")
EMAIL_HOST_USER = CNF.get("DEFAULT", "EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = CNF.get("DEFAULT", "EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = True
