from django.db import models

class ChoiceSentence(models.Model):

    def __str__(self):
        return f"{self.sentence[0:50]}"

    sentence = models.CharField(max_length=650)
    hidden_query = models.CharField(max_length=250)

class Completion(models.Model):

    def __str__(self):
        return f"{self.sentence[0:50]}"

    sentence = models.CharField(max_length=650)
    choices = models.ManyToManyField(ChoiceSentence, related_name="nlp_sentence_choices", blank=True)

class Query(models.Model):

    def __str__(self):
        return f"{self.query}"

    query = models.CharField(max_length=250)
    completions = models.ManyToManyField(Completion, related_name="nlp_completion", blank=True)
