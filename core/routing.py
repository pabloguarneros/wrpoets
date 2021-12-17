from django.urls import re_path
from cs113.consumers import ChatConsumer
from cs113.consumersFinal import FiniConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat', ChatConsumer.as_asgi()),
    re_path(r'ws/fini', FiniConsumer.as_asgi())
]