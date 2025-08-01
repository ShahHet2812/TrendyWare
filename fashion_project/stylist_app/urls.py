from django.urls import path
from .views import AIStylistView

urlpatterns = [
    path('stylist/', AIStylistView.as_view(), name='ai_stylist'),
]