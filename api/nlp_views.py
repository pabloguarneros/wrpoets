from django.http import JsonResponse
from transformers import AutoTokenizer, AutoModel, pipeline
import tensorflow as tf

def generate_sentences(story_gen, query):

    sentences = story_gen(f"<BOS> <action>{query}")[0]["generated_text"]

    while len(sentences.split('. ')) < 2:
        sentences = story_gen(f"<BOS> <action>{query}")[0]["generated_text"]

    sentence_1 = f"{sentences.split('. ')[0][14:]}."
    sentence_2 = f"{sentences.split('. ')[1]}"

    return (sentence_1, sentence_2)

def ensure_low_word_count(query):

    words = query.split(" ")
    if len(words) > 8:
        words = words[:8]
    return " ".join(words)

def generate_completion(query):

    '''
    Input: query
    Output: completed query, three more choices, query_for_each_choice.
    '''

    story_gen = pipeline("text-generation", "pranavpsv/gpt2-genre-story-generator")

    s_0_1, s_0_2 = generate_sentences(story_gen, ensure_low_word_count(query))

    completion_library = {"completed_sentence":f"{s_0_1}","choices":[]}

    for _ in range(3):

        s_1_1, s_1_2 = generate_sentences(story_gen, ensure_low_word_count(query))

        completion_library["choices"].append(
                        {"choice": f"{s_1_1}",
                        "hidden_query": f"{s_1_2}"})
    
    return completion_library


def hugging_face_one(request):

    query = request.GET.get('q', None)

    completion_library = generate_completion(query)
    
    return JsonResponse(completion_library, status=201)


def hugging_face_preload(request):
    query_string = request.GET.get('q', None)
    choices = query_string.split("||")

    completion_libraries = {}

    for choice in choices:
        completion_libraries[choice] = generate_completion(choice)
    
    return JsonResponse(completion_libraries, status=201)
