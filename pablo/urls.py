from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import logout, userProfile, userPreviewProfile
from core import views as core_views

urlpatterns = [
    path('',core_views.home,name="home"),
    path('karla/', admin.site.urls),
    path('room/',include(('rooms.urls','rooms'),namespace='rooms')),
    path('people/',include(('users.urls','users'),namespace='people')),
    path('user/<str:username>', userProfile,name="profile"),
    path('user/<str:username>/preview', userPreviewProfile,name="profile_preview"),
    path('logout', logout),
    path('nubes/', include(('api.urls','api'),namespace='api')),
    path('nubes-auth/',include('rest_framework.urls',namespace='rest-framework')),
    path('', include('django.contrib.auth.urls')),
    path('', include('social_django.urls')),
    path('test404',core_views.error_404)
] 

if settings.DEBUG: 
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = core_views.error_404
handler500 = core_views.error_500
handler403 = core_views.error_403
handler400 = core_views.error_400
    