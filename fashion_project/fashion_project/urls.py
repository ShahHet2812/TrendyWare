"""
URL configuration for fashion_project project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("stylist_app.urls")),
]

# This explicitly tells Django to serve files from your MEDIA_ROOT
# when a URL matches your MEDIA_URL. This is the standard and most
# reliable method for handling user-provided data like your image dataset.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)