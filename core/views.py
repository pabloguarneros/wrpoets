from django.shortcuts import render

def home(request):
    return render(request,'core/home.html')

def error_404(request,exception=False):
    context = {
        "error": "404 error",
        "error_message": "I think I feel an error.<br>Do you feel it too?<br>The wind of a page that ran away.<br>Now gone, the page cannot be found.",
    }
    return render(request,"core/404.html",context)

def error_500(request):
    context = {
        "error": "500 error",
        "error_message": "There's a problem.<br>It's our fault.<br>Probably a bug in the code.<br>We'll fix it, don't worry.<br>Tell us what went wrong, and we'll write you an ode.",
    }
    return render(request,"core/404.html",context)

def error_403(request,exception=False):
    context = {
        "error": "403 error",
        "error_message": "<br>With time, a lock erodes.<br> And a proper key can fit. <br> I'm sorry, though, <br> For now you can't enter.<br>But we'll let you in, some day.",
    }
    return render(request,"core/404.html",context)

def error_400(request,exception=False):
    context = {
        "error": "400 error",
        "error_message": "It seems you sent a bad request.<br>Something was mistyped or wasn't typed at all.<br>One would recommend 'refresh n try again'.",
    }
    return render(request,"core/404.html",context)