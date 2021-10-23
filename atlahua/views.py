from django.shortcuts import render

def paint(request):
    return render(request, "atlahua/paint.html")
