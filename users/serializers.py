
from rest_framework import serializers
from django.contrib.humanize.templatetags.humanize import naturaltime
from .models import User

class SingleUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username','blurb','patreon')

