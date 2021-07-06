from rest_framework import serializers
from django.contrib.humanize.templatetags.humanize import naturaltime
from experiments.models import NodeImages, SectionNode, Lesson


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = ('pk','title','description','public')
    
class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = NodeImages
        fields = ('image',)

class NodeSerializer(serializers.ModelSerializer):

    images = ImageSerializer(many=True,read_only=True)

    class Meta:
        model = SectionNode
        fields = ('pk','title','squishy','description','x_position','y_position','z_position','images')
