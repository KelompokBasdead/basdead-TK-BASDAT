from django.urls import path
from . import views

urlpatterns = [
    path('artists/', views.get_artists, name='get_artists'),
    path('ticket_categories/', views.get_artists, name='get_ticket_categories'),
]