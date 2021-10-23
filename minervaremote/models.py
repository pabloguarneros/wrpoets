from django.db import models
from PIL import Image

def memory_image_directory_path(instance, filename): 
    return 'memories/{0}/{1}'.format(instance.author, f"{filename}") 

class Memory(models.Model):

    author = models.CharField(max_length=150)
    location = models.CharField(max_length=150, blank=True, null=True)
    link = models.URLField(max_length=320, blank=True, null=True)
    photo = models.ImageField(upload_to=memory_image_directory_path)

    class MemoryCategory(models.IntegerChoices):
        FARMING = 1
        PET = 2

    memory_category = models.IntegerField(choices=MemoryCategory.choices, default=1, null=True)


    def save(self, *args, **kawrgs):
        super().save(*args, **kawrgs)

        photo = Image.open(self.photo.path)
        min_size = min(photo.width, photo.height)
        box = (
            ((photo.width-min_size)/2),
            ((photo.height-min_size)/2),
            min_size+((photo.width-min_size)/2),
            min_size+((photo.height-min_size)/2)
            )

        photo = photo.crop(box)

        if photo.width > 512 or photo.height > 512:
            new_img = (512, 512)
            photo.thumbnail(new_img)
            photo = photo.convert() 
            photo.save(self.photo.path,"PNG")