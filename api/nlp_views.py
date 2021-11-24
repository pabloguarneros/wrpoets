from rest_framework.permissions import SAFE_METHODS, IsAuthenticated, BasePermission
from rest_framework import generics

from atlahua.models import Query, Completion, ChoiceSentence
from .serializers import CompletionSerializer, QuerySerializer

def ensure_low_word_count(query):

    words = query.split(" ")
    if len(words) > 8:
        words = words[:8]
    return " ".join(words)

class GetNLPCompletion(generics.ListAPIView):

    serializer_class = CompletionSerializer

    class NodeUserWritePermission(BasePermission):
        
        def has_permission(self, request, view):
            return True
    
    permission_classes = [NodeUserWritePermission]

    def get_queryset(self):

        query = ensure_low_word_count(self.kwargs['q'])

        try:
            query_obj = Query.objects.get(query=query)
        except Query.DoesNotExist:
            query_obj = Query.objects.filter(query="WILL NEVER EXISSST")
            return {}

        completions = query_obj.completions.all()
        return completions