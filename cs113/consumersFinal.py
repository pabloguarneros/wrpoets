import json
import time
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

def initialiseProlog(w):

    prolog = Prolog()
    prolog._init_prolog_thread()

    def ask(Q, A):
        question = Q if isinstance(Q, psw.Atom) else Q.decode("utf-8")
        if isinstance(A, psw.Variable):
            w.send({'prolog_message': f"{question}"})
            readers = [w]
            while readers:
                for r in wait(readers):
                    try:
                        answer = r.recv()
                    except EOFError:
                        readers.remove(r)
                    else:
                        A.unify(answer)
                        return True
        return False

    def alertUser(A):
        alert_message = A if isinstance(A, psw.Atom) else A.decode("utf-8")
        w.send({'prolog_message': f"{alert_message}",
                'is_alert':True})
        readers = [w]
        time.sleep(1)
        while readers:
            for r in wait(readers):
                try:
                    r.recv()
                except EOFError:
                    readers.remove(r)
                else:
                    return True
        return True #to change

    def finalize():
        print("Closing Thread")
        w.close()

    psw.registerForeign(ask, arity=2)
    psw.registerForeign(alertUser, arity=1)
    psw.registerForeign(finalize, arity=1)

    assertz = psw.Functor("assertz", 1)
    asserta = psw.Functor("asserta", 1)
    retract = psw.Functor("retract", 1)

    prolog.consult("static/prolog/financeKB.pl")
    club = [s for s in prolog.query("startProgram.", maxresult=1)]
    print(f"These are the results: {club}")

class FiniConsumer(WebsocketConsumer):

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