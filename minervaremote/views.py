from django.shortcuts import render
from .models import Memory

def welcome(request):
    plant_memories = Memory.objects.all()
    context = {
            "plant_memories": plant_memories,
        }
    return render(request,'minervaremote/welcome.html',context)