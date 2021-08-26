from django.db import models
from django.contrib.auth.models import AbstractUser
from PIL import Image
from django.db.models.deletion import SET_NULL
from rooms.models import Lesson

def profile_pic_directory_path(instance, filename): 
    return 'users/{0}/profile_pic/{1}'.format(instance.username, f"{filename}")  

class User(AbstractUser):
    email = models.EmailField('email')
    profile_pic = models.ImageField(upload_to=profile_pic_directory_path, blank=True)
    blurb = models.TextField(blank=True)
    patreon = models.URLField(blank=True)
    lessons = models.ManyToManyField(Lesson,blank=True)
    portfolio = models.ForeignKey(Lesson,blank=True,null=True,on_delete=models.SET_NULL,related_name="three_d_portfolio")
    explorable = models.BooleanField(default=False)
