from django.urls import path
from . import views

urlpatterns = [
    path('explore/collections',views.ExploreCourses.as_view(),name="explore_courses"),
    path('courses',views.Courses.as_view(),name="course_list"),
    path('courses/<int:pk>',views.CourseDetail.as_view(),name="course_details"),
    path('nodes/<int:lesson_pk>',views.Nodes.as_view(),name="node_list"),
    path('nodes/<int:lesson_pk>/<int:pk>', views.NodeDetail.as_view(),name="node_details"),
    path('images/<int:node_pk>',views.NodeImage.as_view(),name="image_list"),
    path('images',views.Images.as_view(),name="image_list"),

]
