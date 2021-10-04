from django.db import models

class Language(models.Model):
    name = models.CharField(max_length=50)

class Word(models.Model):
    word = models.CharField(max_length=60)
    language = models.ManyToManyField(Language)

class InitialEntry(models.Model):
    text = models.TextField()
    created = models.DateField(auto_now_add=True) 

    def example_nlp(self):
        text = self.text
        return text

