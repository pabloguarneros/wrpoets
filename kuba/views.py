from django.shortcuts import render

def welcome(request):
    return render(request,'kuba/welcome.html')