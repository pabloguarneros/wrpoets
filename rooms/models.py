from django.db import models
from PIL import Image
from django.db.models.fields import CharField

class SectionNode(models.Model):

    def __str__(self):
	    return f"{self.title}"

    title = models.CharField(max_length=150,null=True,default="My New Node")
    x_position= models.DecimalField(default=0,max_digits=7, decimal_places=4)
    y_position= models.DecimalField(default=0,max_digits=7, decimal_places=4)
    z_position= models.DecimalField(default=-1,max_digits=7, decimal_places=4)
    
    quat_x = models.DecimalField(default=0,max_digits=9, decimal_places=7)
    quat_y = models.DecimalField(default=0,max_digits=9, decimal_places=7)
    quat_z = models.DecimalField(default=0,max_digits=9, decimal_places=7)
    quat_w = models.DecimalField(default=1,max_digits=9, decimal_places=7)
    
    scale = models.DecimalField(default=.5,max_digits=6, decimal_places=4)
    color = models.CharField(max_length=8,default="F5BD1F")

    def updateMe(self,t,x,z):
        self.title=t
        self.x_position=x
        self.z_position=z
        self.save()

class ImageTag(models.Model):

    def __str__(self):
        return f"{self.name}"
    
    name = models.CharField(max_length=30,blank=True)
    citation = models.TextField(blank=True)


class Lesson(models.Model):

    def __str__(self):
	    return f"{self.title}"

    title = models.CharField(max_length=150)
    description = models.TextField()
    nodes = models.ManyToManyField(SectionNode,related_name='lesson_for_nodes',blank=True)
    public = models.BooleanField(default=False)
    explorable = models.BooleanField(default=False)

    def updateMe(self,title,description):
        self.title=title
        self.description=description
        self.save()


def png_directory_path(instance, filename): 
    # file will be uploaded to MEDIA_ROOT / user_<id>/<filename> 
    return 'section-nodes/{0}/{1}'.format(instance.origin.pk, f"{filename}") 


class NodeImages(models.Model):

    def __str__(self):
	    return f"{self.title}"
    
    class Meta:
        ordering = ['image']

    title = models.CharField(max_length=70,blank=True)

    class ImageCategory(models.IntegerChoices):
        STICKER = 0
        PHOTO = 1
        ILLUSTRATION = 2
        GRAPH = 3

    origin = models.ForeignKey(Lesson,on_delete=models.CASCADE,default=1,related_name="image_owner")
    category = models.IntegerField(choices=ImageCategory.choices, default=None, null=True)
    section = models.ManyToManyField(SectionNode,related_name="images")
    image = models.ImageField(upload_to=png_directory_path)
    is_public = models.BooleanField(default=1)
    tags = models.ManyToManyField(ImageTag,related_name="image_tag",blank=True)


    def save(self, *args, **kawrgs):
        super().save(*args, **kawrgs)

        image = Image.open(self.image.path)
        min_size = min(image.width, image.height)
        box = (
            ((image.width-min_size)/2),
            ((image.height-min_size)/2),
            min_size+((image.width-min_size)/2),
            min_size+((image.height-min_size)/2)
            )

        image = image.crop(box)

        if image.width > 512 or image.height > 512:
            new_img = (512, 512)
            image.thumbnail(new_img)
            image = image.convert() #convert transparency to new image!
            image.save(self.image.path,"PNG")  # saving image at the same path