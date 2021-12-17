from django.urls import path
from . import views

urlpatterns = [
    path('cs113',views.starter),
    path('cs152/LBA',views.prologLBA),
    path('cs152',views.prologFinal)
] 
