from django.contrib import admin
from .models import Memory

class MemoryAdmin(admin.ModelAdmin):
    list_display=('author','memory_category')

admin.site.register(Memory, MemoryAdmin)