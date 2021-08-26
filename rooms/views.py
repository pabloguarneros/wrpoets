from django.shortcuts import render, redirect
from .models import Lesson


def launch_experiment(request):
    return render(request,'rooms/experimental_features/hand_gestures.html')

def view_room(request,lessonID):
    lesson = Lesson.objects.get(pk=lessonID)
    context={
        "lesson":lesson
    }
    return render(request,'rooms/view_room.html',context)


def edit_room(request,lessonID):
    lesson = Lesson.objects.get(pk=lessonID)
    context={
        "lesson":lesson
    }
    if request.user.username and lesson in request.user.lessons.all():
        return render(request,'rooms/edit_room.html',context)
    else:
        return render(request,'rooms/view_room.html',context)