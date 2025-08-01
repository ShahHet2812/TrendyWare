from django.urls import path
from .views import AIStylistView

# This file maps the final part of the URL to your view.
# The full URL will be /api/stylist/
urlpatterns = [
    path("stylist/", AIStylistView.as_view(), name="ai-stylist"),
]