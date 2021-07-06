from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import json
from rest_framework import generics
from django.contrib.auth import logout as log_out
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse
from urllib.parse import urlencode
from .models import User
from . import serializers

def join(request):
    return render(request,'users/discover.html')

def yours(request):
    user = request.user
    if user.is_authenticated:
        context = { "user":user}
        return redirect("people:profile",user.username)
    else:
        return render(request,'users/discover.html')

def teacherProfile(request,username):
    visiting_user = request.user
    visited_user = User.objects.get(username=username)
    if visiting_user.is_authenticated and visiting_user == visited_user:
        context = { "user": visiting_user}
        return render(request,'users/your_profile.html',context)
    else:
        context = {
            "user": visited_user,
        }
        return render(request, 'users/their_profile.html',context)

def portfolioProfile(request,username):
    user = User.objects.get(username=username)
    context = {
        "user": user,
    }
    return render(request, 'users/their_profile.html',context)

def logout(request):
    log_out(request)
    return_to = urlencode({'returnTo': request.build_absolute_uri('/')})
    logout_url = 'https://%s/v2/logout?client_id=%s&%s' % \
                 (settings.SOCIAL_AUTH_AUTH0_DOMAIN, settings.SOCIAL_AUTH_AUTH0_KEY, return_to)
    return HttpResponseRedirect(logout_url)

def saveUser(request):
    user = request.user
    if request.POST:
        user.username = request.POST.get('username')
        user.blurb = request.POST.get('blurb')
        user.patreon = request.POST.get('patreon')
        user.save()
        return HttpResponse("succesful")
    else:
        return HttpResponse("unsuccesful")


class userData(generics.ListAPIView):

    serializer_class = serializers.SingleUserSerializer

    def get_queryset(self):
        username = self.request.user.username
        return User.objects.filter(username=username)
