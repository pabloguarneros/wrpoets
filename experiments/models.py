from django.db import models
from PIL import Image
from django.db.models.fields import CharField

class SectionNode(models.Model):

    def __str__(self):
	    return f"{self.title}"

    title = models.CharField(max_length=150,null=True,default="My New Node")
    description = models.TextField(blank=True)
    x_position= models.DecimalField(default=0,max_digits=7, decimal_places=2)
    y_position= models.DecimalField(default=0,max_digits=7, decimal_places=2)
    z_position= models.DecimalField(default=-1,max_digits=7, decimal_places=2)
    squishy = models.DecimalField(default=0.2, max_digits=7, decimal_places=2)
    color = models.CharField(max_length=8,default="F5BD1F")

    def updateMe(self,t,d,x,z,s):
        self.title=t
        self.description=d
        self.x_position=x
        self.z_position=z
        self.squishy=s
        self.save()

class ImageTag(models.Model):

    def __str__(self):
        return f"{self.name}"
    
    name = models.CharField(max_length=30,blank=True)
    citation = models.TextField(blank=True)


class Template(models.Model):
    def __str__(self):
	    return f"{self.title}"
    title = models.CharField(max_length=60)
    url = models.TextField(default="experiments/js/sing.js")


class Lesson(models.Model):

    def __str__(self):
	    return f"{self.title}"

    title = models.CharField(max_length=150)
    description = models.TextField()
    nodes = models.ManyToManyField(SectionNode,related_name='lesson_for_nodes')
    public = models.BooleanField(default=False)
    explorable = models.BooleanField(default=False)
    template = models.ForeignKey(Template,blank=True,on_delete=models.SET_NULL,null=True)

    class ThreeControls(models.IntegerChoices):
        ORBIT = 0
        THREEDMODEL = 1

    controls = models.IntegerField(choices=ThreeControls.choices, default=0)

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

    origin = models.ForeignKey(Lesson,on_delete=models.SET_DEFAULT,default=1,related_name="image_owner")
    category = models.IntegerField(choices=ImageCategory.choices, default=None, null=True)
    section = models.ManyToManyField(SectionNode,related_name="images")
    image = models.ImageField(upload_to=png_directory_path)
    is_public = models.BooleanField(default=1)
    tags = models.ManyToManyField(ImageTag,related_name="image_tag",blank=True)


    def save(self, *args, **kawrgs):
        super().save(*args, **kawrgs)

        image = Image.open(self.image.path)

        if image.width > 512 or image.height > 512:
            new_img = (512, 512)
            image.thumbnail(new_img)
            image = image.convert() #convert transparency to new image!
            image.save(self.image.path,"PNG")  # saving image at the same path