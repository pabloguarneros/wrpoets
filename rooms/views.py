from django.shortcuts import render
from core.views import get_mobile
from .models import Lesson

def view_room(request,lessonID):
    lesson = Lesson.objects.get(pk=lessonID)
    context={
        "lesson":lesson
    }
    is_mobile = get_mobile(request)
    if is_mobile:
        return render(request,'rooms/view_room.html',context)
    else:
        return render(request,'rooms/desktop/view_room.html',context)

def edit_room(request,lessonID):
    lesson = Lesson.objects.get(pk=lessonID)
    context={
        "lesson":lesson
    }
    if request.user.username and lesson in request.user.lessons.all():
        return render(request,'rooms/edit_room.html',context)
    else:
        return render(request,'rooms/view_room.html',context)