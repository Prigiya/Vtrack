"""
URL configuration for vtrack project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.utils.translation import gettext_lazy

admin.site.site_title = gettext_lazy("vTrack admin")
admin.site.site_header = gettext_lazy("vTrack administration")
admin.site.index_title = gettext_lazy("vTrack administration")

v1 = [
    path("user/", include("user.urls")),
    path("visitor/", include("visitor.urls")),
]

apis = [
    path("v1/", include(v1)),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(apis)),
]

if settings.DEBUG:  # pragma: no cover
    from django.conf.urls.static import static
    from django.urls import re_path
    from drf_yasg import openapi
    from drf_yasg.views import get_schema_view
    from rest_framework import permissions

    info = openapi.Info(
        title="vTrack API",
        default_version="v1",
        description="Visitor tracking",
        terms_of_service="https://acsicorp.com/",
        contact=openapi.Contact(email="jai.jain@acsicorp.com"),
        license=openapi.License(name="Proprietary License"),
    )

    SchemaView = get_schema_view(
        info, public=True, permission_classes=[permissions.AllowAny]
    )

    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        re_path(
            r"^swagger(?P<format>\.json|\.yaml)$",
            SchemaView.without_ui(cache_timeout=0),
            name="schema-json",
        ),
        re_path(
            r"^swagger/$",
            SchemaView.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
        re_path(
            r"^redoc/$",
            SchemaView.with_ui("redoc", cache_timeout=0),
            name="schema-redoc",
        ),
    ]
