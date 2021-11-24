import tensorflow as tf
from transformers import pipeline
from atlahua.models import Query, Completion, ChoiceSentence

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


def generate_completion_object(query):

    story_gen = pipeline("text-generation", "pranavpsv/gpt2-genre-story-generator")
    s_0_1, s_0_2 = generate_sentences(story_gen, query)
    
    query_obj, _ = Query.objects.get_or_create(query=query)
    completion = Completion.objects.create(sentence=s_0_1)

    for _ in range(3):

        s_1_1, s_1_2 = generate_sentences(story_gen, ensure_low_word_count(s_0_2))
        choice = ChoiceSentence.objects.create(sentence=s_1_1,hidden_query=ensure_low_word_count(s_1_2))
        completion.choices.add(choice)
        completion.save()

    query_obj.completions.add(completion)
    query_obj.save()

    return query_obj

def update_database(initial_choices):
    queries = initial_choices
    count = 0
    while len(queries) > 0 and count < 364:
        count += 1
        new_query = queries.pop(0) #queue
        query_obj = generate_completion_object(new_query)
        for completion in query_obj.completions.all():
            for choice_sentence in completion.choices.all():
                queries.append(choice_sentence.hidden_query)

three_phrases = ["Nobody puts Baby in a corner",
                "Just keep swimming",
                "You're a wizard, Harry"]

def run():
    update_database(three_phrases)