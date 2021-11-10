from rest_framework import serializers
from .models import Memory

class MemorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Memory
        fields = ['author', 'location', 'link', 'photo', 'memory_category']