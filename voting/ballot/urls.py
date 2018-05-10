from django.urls import path
from . import views

urlpatterns  = [
    path('create_poll/', views.create_poll, name='create_poll'),
    path('create_proposal/', views.create_proposal, name='create_proposal'),
    path('get_proposal/', views.get_proposal, name='get_proposal'),
    path('get_poll/', views.get_poll, name='get_poll'),
    path('get_all_poll/', views.get_all_poll, name='get_all_poll'),
    path('update_proposal/', views.update_proposal, name='update_proposal'),
    path('update_poll/', views.update_poll, name='update_poll'),
    path('get_list_proposals/', views.get_list_proposals, name='get_list_proposals'),
    path('get_image/', views.get_image, name='get_image'),
    path('<str:address>/image/', views.get_image_url, name='get_image_url')
]