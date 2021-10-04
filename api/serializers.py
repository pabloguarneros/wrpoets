from rest_framework import serializers
from rooms.models import NodeImages, SectionNode, Lesson

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
        fields = ('pk','title',
                'x_position','y_position','z_position',
                'quat_x', 'quat_y', 'quat_z', 'quat_w',
                'scale','images')
