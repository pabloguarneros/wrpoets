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

    def save(self, *args, **kawrgs):

        if self.profile_pic:
            
            super().save(*args, **kawrgs)

            image = Image.open(self.profile_pic.path)
            min_size = min(image.width, image.height)
            box = (
                ((image.width-min_size)/2),
                ((image.height-min_size)/2),
                min_size+((image.width-min_size)/2),
                min_size+((image.height-min_size)/2)
                )
            image = image.crop(box)

            if image.width > 256 or image.height > 256:
                new_img = (256, 256)
                image.thumbnail(new_img)
                image = image.convert()
                image.save(self.profile_pic.path,"JPEG")