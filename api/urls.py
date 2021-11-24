from django.urls import path
from . import views, nlp_views
from minervaremote.views import MemoryQuery

urlpatterns = [
    path('explore/collections',views.ExploreRooms.as_view(),name="explore_rooms"),
    path('rooms',views.Rooms.as_view(),name="course_list"),
    path('rooms/<int:pk>',views.RoomDetail.as_view(),name="course_details"),
    path('nodes/<int:lesson_pk>',views.Nodes.as_view(),name="node_list"),
    path('nodes/<int:lesson_pk>/<int:pk>', views.NodeDetail.as_view(),name="node_details"),
    path('images/<int:node_pk>',views.NodeImage.as_view(),name="image_list"),
    path('minerva/get_remote_experiences', MemoryQuery.as_view(),name="memory_query"),
    path('images',views.Images.as_view(),name="image_list"),
    path('huggingface/<q>', nlp_views.GetNLPCompletion.as_view(), name="hugging_face_completion"),
]
