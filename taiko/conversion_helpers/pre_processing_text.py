

class LanguageToolkit:

    def __init__(self):

        self.numbers = {'0','1','2','3','4','5','6','7','8','9'}
        self.english_letters = {'a','b','c','d','e','f','g','h','i','j','k','l','m',
                    'n','o','p','q','r','s','t','u','v','w','x','y','z'}

        self.punctuation = {",",".","-",";",":","!","?","¿","¡","(",")","[","]","{","}"}
        self.empty_space = " "

class TaikoText:

    def __init__(self, raw_text):

        self.tk = LanguageToolkit()
        self.text = raw_text
        self.words = {}
        self.rhyming_groups = {}
    
    def remove_footnotes(self):

        new_text = ""
        had_footnote = False

        for index, character in enumerate(self.text):

            if character in self.tk.punctuation and character != ".":

                if had_footnote:
                    continue

            if character in self.tk.numbers:

                if had_footnote:
                    continue

                if self.text[index-1].lower() in self.tk.english_letters:
                    had_footnote = True
                    continue

            if had_footnote and character == self.tk.empty_space:

                had_footnote = False

            new_text += character

        self.text = new_text

    def load_words(self):

        new_dictionary = {}
        current_word = ""

        for index, character in enumerate(self.text):
            
            if character == self.tk.empty_space or character == ".":

                if current_word in new_dictionary:
                    new_dictionary[current_word] += 1
                else:
                    new_dictionary[current_word] = 1

                current_word = ""
                continue

            current_word += character

        self.words = new_dictionary

    def find_rhymes(self):

        potential_rhymes = {}
        final_rhymes = {} 

        for word, _ in self.words.items():

            if len(word) >= 4:
                end_rhyme = word[-4:]
                if end_rhyme in potential_rhymes:
                    if end_rhyme in final_rhymes:
                        final_rhymes[end_rhyme].append(word)
                    else:
                        final_rhymes[end_rhyme] = [potential_rhymes[end_rhyme][0], word]
                else:
                    potential_rhymes[end_rhyme] = [word]

        self.rhyming_groups = final_rhymes


    def make_sonnet(self):

        word_pairs = [[value[0],value[-1]] for _, value in self.rhyming_groups.items()]

        combination = ""

        for i in range(len(word_pairs)):
            if i % 4 == 3:
                combination += f"</br>"
            if i % 2 == 0:
                try:
                    combination += f"</br>{word_pairs[i+1][0]} {word_pairs[i][0]}"
                    combination += f"</br>{word_pairs[i+1][1]} {word_pairs[i][1]}"
                except IndexError:
                    break
        
        return combination.lower()

