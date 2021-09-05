from django.shortcuts import render, redirect
from rest_framework import generics
from django.contrib.auth import logout as log_out
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse
from urllib.parse import urlencode
from core.views import get_mobile
from .models import User
from . import serializers


def join(request):
    return render(request,'users/discover.html')

def yours(request):
    user = request.user
    if user.is_authenticated:
        return redirect("profile", user.username)
    else:
        return render(request,'users/discover.html')

def userProfile(request,username):

    is_mobile = get_mobile(request)
    profile_owner = User.objects.get(username=username)

    context = {
            "user": profile_owner,
            "is_mobile": is_mobile,
        }

    if request.user.is_authenticated and request.user == profile_owner:
        return render(request,'users/your_profile.html',context)

    else:
        return render(request, 'users/their_profile.html',context)

def userPreviewProfile(request, username):
    is_mobile = get_mobile(request)

    context = {
            "user": request.user,
            "is_mobile": is_mobile,
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
