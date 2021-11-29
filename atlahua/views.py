from django.shortcuts import render

def main(request):
    return render(request, "atlahua/main.html")

def paint(request):
    return render(request, "atlahua/paint.html")


def ipad_paint(request):
    return render(request, "atlahua/ipad_paint.html")