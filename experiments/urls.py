from django.urls import path
from . import views

urlpatterns = [
    path('t/<str:lessonID>',views.sing),
] 



