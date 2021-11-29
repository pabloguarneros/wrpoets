from django.urls import path
from . import views

urlpatterns = [
    path('',views.main),
    path('1',views.paint),
    path('2',views.ipad_paint)
] 
