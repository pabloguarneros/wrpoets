from django.contrib import admin
from .models import NodeImages, SectionNode, Lesson, ImageTag


class ImageTagAdmin(admin.ModelAdmin):
    list_display=('name',)

class NodeImagesAdmin(admin.ModelAdmin):
    list_display=('pk','title','category','image')

class SectionNodeAdmin(admin.ModelAdmin):
    list_display=('title','x_position','z_position')

class LessonAdmin(admin.ModelAdmin):

    def poems_count(self, obj):
        return obj.nodes.count()

    poems_count.short_description = "Poem Count" 
    list_display=('title','poems_count','explorable','public')

admin.site.register(NodeImages,NodeImagesAdmin)
admin.site.register(SectionNode,SectionNodeAdmin)
admin.site.register(Lesson,LessonAdmin)
admin.site.register(ImageTag,ImageTagAdmin)