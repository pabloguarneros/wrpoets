from django.http import JsonResponse
import random
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated, BasePermission
from rest_framework import generics
from transformers import AutoTokenizer, AutoModel, pipeline
import tensorflow as tf
from atlahua.models import Query, Completion, ChoiceSentence
from .serializers import CompletionSerializer, QuerySerializer

def generate_sentences(story_gen, query):

    sentences = story_gen(f"<BOS> <action>{query}")[0]["generated_text"]

    while len(sentences.split('. ')) < 2:
        sentences = story_gen(f"<BOS> <action>{query}")[0]["generated_text"]

    sentence_1 = f"{sentences.split('. ')[0][14:]}."
    sentence_2 = f"{sentences.split('. ')[1]}"

    return (sentence_1, sentence_2)

def ensure_low_word_count(query):

    words = query.split(" ")
    if len(words) > 8:
        words = words[:8]
    return " ".join(words)


def generate_completion_object(query):

    story_gen = pipeline("text-generation", "pranavpsv/gpt2-genre-story-generator")
    s_0_1, s_0_2 = generate_sentences(story_gen, query)
    
    query_obj, _ = Query.objects.get_or_create(query=query)
    completion = Completion.objects.create(sentence=s_0_1)

    for _ in range(3):

        s_1_1, s_1_2 = generate_sentences(story_gen, ensure_low_word_count(s_0_2))
        choice = ChoiceSentence.objects.create(sentence=s_1_1,hidden_query=ensure_low_word_count(s_1_2))
        completion.choices.add(choice)
        completion.save()

    query_obj.completions.add(completion)
    query_obj.save()

    return query_obj


class GetNLPCompletion(generics.ListAPIView):

    serializer_class = CompletionSerializer

    class NodeUserWritePermission(BasePermission):
        
        def has_permission(self, request, view):
            return True
    
    permission_classes = [NodeUserWritePermission]

    def get_queryset(self):

        query = ensure_low_word_count(self.kwargs['q'])

        try:
            query_obj = Query.objects.get(query=query)
        except Query.DoesNotExist:
            query_obj = generate_completion_object(query)

        completions = query_obj.completions.all()

        return completions