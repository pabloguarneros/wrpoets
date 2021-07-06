from django.urls import path
from . import views

urlpatterns = [
    path('',views.join),
    path('t/<str:username>',views.teacherProfile,name="profile"),
    path('u/<str:username>',views.portfolioProfile),
    path('me',views.yours,name="me"),
    path('info/api/single',views.userData.as_view()),
    path('info/api/single',views.userData.as_view()),
    path('save/manager/user',views.saveUser),

]

