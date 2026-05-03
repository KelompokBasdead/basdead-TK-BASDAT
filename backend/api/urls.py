from django.urls import path
from . import views

urlpatterns = [
    path('artists/', views.get_artists, name='get_artists'),
    path('artists/add/', views.add_artist, name='add_artist'),
    path('artists/<str:artist_id>/update/', views.update_artist, name='update_artist'),
    path('artists/<str:artist_id>/delete/', views.delete_artist, name='delete_artist'),
    path('ticket-categories/', views.get_ticket_categories, name='get_ticket_categories'),
    path('ticket-categories/add/', views.add_ticket_category, name='add_ticket_category'),
    path('ticket-categories/<str:category_id>/update/', views.update_ticket_category, name='update_ticket_category'),
    path('ticket-categories/<str:category_id>/delete/', views.delete_ticket_category, name='delete_ticket_category'),
]