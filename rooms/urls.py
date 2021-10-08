from django.urls import path
from . import views

urlpatterns = [
    path('<str:lessonID>',views.view_room),
    path('edit/<str:lessonID>',views.edit_room),
] 



