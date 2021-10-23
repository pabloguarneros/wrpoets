from django.shortcuts import render
from .models import Memory

def welcome(request):
    plant_memories = Memory.objects.filter(memory_category=1)
    pet_memories = Memory.objects.filter(memory_category=2)
    context = {
            "plant_memories": plant_memories,
            "pet_memories": pet_memories,
        }
    return render(request,'minervaremote/welcome.html',context)