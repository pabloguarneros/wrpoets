from django.urls import path
from . import views

urlpatterns = [
    path('',views.main),
    path('1',views.paint),
] 
