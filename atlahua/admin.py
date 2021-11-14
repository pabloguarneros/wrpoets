from django.contrib import admin

# Register your models here.
from .models import Query, Completion, ChoiceSentence

admin.site.register(Query)
admin.site.register(Completion)
admin.site.register(ChoiceSentence)