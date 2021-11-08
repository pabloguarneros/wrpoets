from django.urls import path
from . import views

urlpatterns = [
    path('',views.welcome),
    path('convert',views.CreateSong.as_view(),name="convert"),
    path('easy_on_me',views.convolution)
] 
