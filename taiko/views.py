from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from django.core import serializers
from .conversion_helpers.pre_processing_text import TaikoText


def welcome(request):
    return render(request,'taiko/load_paper.html')

def convolution(request):
    return render(request,'taiko/convolute.html')

class CreateSong(generics.RetrieveAPIView):

    def get(self, request, format=None):

        text = TaikoText(request.query_params["text"])
        text.remove_footnotes()
        text.load_words()
        text.find_rhymes()

        return Response(f"{text.make_sonnet()}",content_type='text/plain; charset=UTF-8')
