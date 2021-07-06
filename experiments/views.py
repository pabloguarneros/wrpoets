from django.shortcuts import render, redirect
from .models import Lesson


def sing(request,lessonID):
    lesson = Lesson.objects.get(pk=lessonID)
    context={
        "lesson":lesson
    }
    return render(request,'experiments/sing.html',context)