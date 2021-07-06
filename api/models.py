from django.db import models

# Create your models here.
'''
Cool things to add to models
class Meta:
    ordering = (-XX,)
class __str__(self):
    return self.title
class PostObjects(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status='published')
'''
