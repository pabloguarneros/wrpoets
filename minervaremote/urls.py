from django.urls import path
from . import views

urlpatterns = [
    path('',views.welcome),
    path('get_experiences',views.MemoryQuery.as_view(),name="memory_query"),

] 
