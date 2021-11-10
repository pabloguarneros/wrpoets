from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated, BasePermission
from .models import Memory
from . import serializers


def welcome(request):
    return render(request,'minervaremote/welcome.html')

class MemoryQuery(generics.ListCreateAPIView):

    serializer_class = serializers.MemorySerializer

    def get_queryset(self):
        #category = self.request.query_params.get('category', None)
        return Memory.objects.all()