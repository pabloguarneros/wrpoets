from django.shortcuts import render

def starter(request):
    return render(request,"cs113/deep_dive_1.html")

def prologLBA(request):
    return render(request,"cs113/prologLBA.html")

def room(request, room_name):
    return render(request, 'cs113/room.html', {
        'room_name': room_name
    })