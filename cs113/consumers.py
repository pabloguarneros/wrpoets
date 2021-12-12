import json
import pyswip as psw
import threading
from channels.generic.websocket import WebsocketConsumer
from multiprocessing import Pipe, Process
from multiprocessing.connection import wait
from pyswip.core import _findSwipl
from pyswip.core import CDLL
from ctypes import *

# Go Native because pyswip's thread wasn't working
(_path, SWI_HOME_DIR) = _findSwipl()
nativeProlog = CDLL(_path, mode=RTLD_GLOBAL)

class Prolog(psw.Prolog):

    def _init_prolog_thread(cls):
        x = threading.Thread(target=nativeProlog.PL_thread_self, args=[1], daemon=True)
        x.start()

def humanize_askable(A,V):
        str_A, str_V = str(A), str(V)
        if str_A == "instruct":
            question = "Want to find a night club? Swipe left for yes. Swipe right for no."
            options = ["yes", "no"]
        elif str_A == "covid" and str_V == "vaccinated":
            question = "Are you vaccinated?"
            options = ["yes", "no"]
        elif str_A == "covid" and str_V == "recovered":
            question = "Have you recently recovered from covid?"
            options = ["yes", "no"]
        elif str_A == "population" and str_V == "high_risk":
            question = "Are covid levels at high risk where you are?"
            options = ["yes", "no"]
        elif str_A == "abroad" and str_V == "past_month":
            question = "Have you been abroad in the past month?"
            options = ["yes", "no"]
        elif str_A == "mask" and str_V == "ffptwo":
            question = "Are you willing to wear a mask?"
            options = ["yes", "no"]
        elif str_A == "residence" and str_V == "close":
            question = "Do you want somewhere close to the res?"
            options = ["yes", "no"]
        elif str_A == "outfit":
            question = f"Is your outfit {str_V}?"
            options = ["yes", "no"]
        elif str_A == "speaker" and str_V == "german":
            question = "Do you speak german?"
            options = ["yes", "no"]
        elif str_A == "volume" and str_V == "loud":
            question = "Are you ok with loud music?"
            options = ["yes", "no"]
        elif str_A == "group" and str_V == "big":
            question = "Are you going with a big group?"
            options = ["yes", "no"]
        elif str_A == "price":
            question = f"What is the most you want to spend in euros?"
            options = ["six","ten","twelve","fifteen"]
        elif str_A == "energy":
            question = f"How energetic are you feeling?"
            options = ["low","mid","high"] 
        elif str_A == "mood":
            question = f"What is your mood?"
            options = ["chill","happy","wild","sexual"] 
        else:
            question = f"{str_A}{str_V}"
            options = ["chill","happy","wild","sexual"] 
        
        return (question, options)

def initialiseProlog(w):

    prolog = Prolog()
    prolog._init_prolog_thread()
    retractall = psw.Functor("retractall")
    known = psw.Functor("known",3)
    
    def defaultUnify(Y,msg):
        Y.unify(msg)
        
    def yes_no(A,V,Y):
        if isinstance(Y, psw.Variable):
            question, options = humanize_askable(A,V)
            w.send({
                    'type': "question",
                    'question': question,
                    'options': options
                })
            readers = [w]
            while readers:
                for r in wait(readers):
                    try:
                        msg = r.recv()
                    except EOFError:
                        readers.remove(r)
                    else:
                        defaultUnify(Y,msg)
                        return True
        return False

    def resolve(club):
        if club:
            match = "You should go to " + club[0]['X'].capitalize() + "."
        else:
            match = "Go back to the res!"
        w.send({
            'type': "match",
            'match': match,
        })
        w.close()

    psw.registerForeign(yes_no, arity=3)
    psw.registerForeign(resolve, arity=1)

    prolog.consult("static/prolog/clubKB.pl")
    psw.call(retractall(known))
    club = [s for s in prolog.query("club(X).", maxresult=1)]
    resolve(club)

class ChatConsumer(WebsocketConsumer):
    
    def __init__(self, *args, **kwargs):

        self.readers = []

        if self.groups is None:
            self.groups = []

    def connect(self):
        self.accept()
        self.await_message()
        
    def await_message(self):
        for r in wait(self.readers):
            try:
                msg = r.recv()
            except EOFError:
                self.readers.remove(r)
            else:
                self.send(json.dumps(msg)) # send message dictionary

    
    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        self.r.send(message)
        self.await_message()

class ChatConsumerOld(WebsocketConsumer):

    def __init__(self, *args, **kwargs):

        r, w = Pipe(duplex=True)
        self.readers = []
        self.r = r
        self.readers.append(self.r)
        self.p = Process(target=initialiseProlog, args=[w])
        self.p.start()
        w.close()

        if self.groups is None:
            self.groups = []

    def connect(self):
        self.accept()
        self.await_message()
        
    def await_message(self):
        for r in wait(self.readers):
            try:
                msg = r.recv()
            except EOFError:
                self.readers.remove(r)
            else:
                self.send(json.dumps(msg)) # send message dictionary

    
    def disconnect(self, close_code):
        self.p.terminate()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        self.r.send(message)
        self.await_message()