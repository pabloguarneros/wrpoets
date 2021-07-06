from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from django.core.files.base import ContentFile
from django.core.files import File as DjangoFile
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated, IsAdminUser, BasePermission
from experiments.models import Lesson, SectionNode, NodeImages, ImageTag
from users.models import User
from . import serializers

class ExploreCourses(generics.ListAPIView):
    serializer_class = serializers.CourseSerializer

    def get_queryset(self):
        return Lesson.objects.filter(explorable=True,public=True)

class Courses(generics.ListCreateAPIView):

    '''
    Returns the lessons given the requested user
    Creates given the request user
    '''

    serializer_class = serializers.CourseSerializer
    permission_classes = [IsAuthenticated]

    def post(self,request):
        serializer = serializers.CourseSerializer(data=request.data)
        if serializer.is_valid():
            lesson_object = serializer.save()
            user = self.request.user
            user.lessons.add(lesson_object)
            user.save()
            pk_returned = lesson_object.pk
            return JsonResponse({"pk":pk_returned},status=201)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.request.user.lessons

class CourseDetail(generics.RetrieveUpdateDestroyAPIView):
    
    #Returns the specific course given the endpoint's <int:pk> argument

    class LessonUserWritePermission(BasePermission):

        #Only allows the owner to update or destroy the specific course

        message = "Editing is restricted to author only"

        def has_object_permission(self, request, view, obj):
            if request.method in SAFE_METHODS:
                return True
            return obj in request.user.lessons.all()

    permission_classes = [LessonUserWritePermission]
    serializer_class = serializers.CourseSerializer
    queryset = Lesson.objects.all()

class Nodes(generics.ListCreateAPIView):

    '''
    Returns the node given the requested lesson
    '''
    serializer_class = serializers.NodeSerializer

    class LessonUserWritePermission(BasePermission):

        #Only allows the owner to update or destroy the specific course

        message = "Adding to the lesson is restricted to authors only"
        
        def has_permission(self, request, view):
            if request.method in SAFE_METHODS:
                return True
            return Lesson.objects.get(pk=view.kwargs['lesson_pk']) in request.user.lessons.all()
    
    permission_classes = [LessonUserWritePermission]

    def post(self,request,lesson_pk):
        serializer = serializers.NodeSerializer(data=request.data)
        if serializer.is_valid():
            node_object = serializer.save()
            lesson = Lesson.objects.get(pk=lesson_pk)
            lesson.nodes.add(node_object)
            lesson.save()
            pk_returned = node_object.pk
            return JsonResponse({"pk":pk_returned},status=201)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        lesson = Lesson.objects.get(pk=self.kwargs['lesson_pk'])
        return lesson.nodes

class NodeDetail(generics.RetrieveUpdateDestroyAPIView):
    
    #Returns the specific course given the endpoint's <int:pk> argument
    class NodeUserWritePermission(BasePermission):

        message = "Editing is restricted to author only"

        def has_object_permission(self, request, view, obj):
            if request.method in SAFE_METHODS:
                return True
            user_is_owner = False
            for lesson in obj.lesson_for_nodes.all():
                if lesson in request.user.lessons.all():
                    user_is_owner = True
            return user_is_owner
    
    def post(self, request, pk, *args, **kwargs):
        node = SectionNode.objects.get(pk=pk)
        lesson = node.lesson_for_nodes.all()[0]
        files = request.FILES
        for i in range(len(files)):
            image = NodeImages(image=files[f"{i}"],origin=lesson)
            image.save()
            image.section.add(node)
            image.save()
        return Response(status=204)

    permission_classes = [NodeUserWritePermission]
    serializer_class = serializers.NodeSerializer
    queryset = SectionNode.objects.all()


class Images(generics.ListCreateAPIView):

    serializer_class = serializers.ImageSerializer

    def get_queryset(self):
        tag_pk = self.request.query_params.get('tag', None)
        if tag_pk == None:
            return NodeImages.objects.all()[0:50]
        else:
            tag = ImageTag.objects.get(pk=tag_pk)
            return tag.image_tag.all()


class NodeImage(generics.ListCreateAPIView):

    '''
    Returns the image given the requested node
    '''
    serializer_class = serializers.ImageSerializer

    class NodeUserWritePermission(BasePermission):

        #Only allows the owner to update or destroy the specific course

        message = "Adding images to the node is restricted to authors only"
        
        def has_permission(self, request, view):
            if request.method in SAFE_METHODS:
                return True
            node = SectionNode.objects.get(pk=view.kwargs['node_pk'])
            return node.lesson_for_nodes.all()[0] in request.user.lessons.all()
    
    permission_classes = [NodeUserWritePermission]

    def perform_create(self, serializer):
        node = SectionNode.objects.get(pk=self.kwargs['node_pk'])
        image_object = serializer.save()
        image_object.section.add(node)
        image_object.save()

    def get_queryset(self):
        node = SectionNode.objects.get(pk=self.kwargs['node_pk'])
        return node.images.all()
