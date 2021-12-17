const domKB = `

:- use_module(library(dom)).
:- use_module(library(lists)).
:- use_module(library(random)).

:- dynamic(currentPredicate/1).
:- dynamic(userName/1).

init :-
    domInit,
    introduction.

introduction :-
	recordChat('Hello, I am Fini!', prologMessage),
    recordChat('What is your name, future finance wizz?', prologMessage),
    asserta(currentPredicate(greet)).

greet(X) :-
    atomic_list_concat(['Well ', X, ', it is a pleasure to embark on this learning quest with you!'], OurResponse),
    asserta(userName(X)),
    recordChat(OurResponse, prologMessage),
    recordChat('What do you want to know?', prologMessage),
    retract(currentPredicate(greet)),
    asserta(currentPredicate(toSeek)).

domInit :- 
    get_by_id(userInputSubmitButton, X),
    bind(X, click, Event, sendMessage(Event)).

sendMessage(Event) :-
    prevent_default( Event ),
    get_by_id(userInputText,Y),
    get_attr( Y, value, Text ),
    recordChat(Text, userMessage),
    set_attr( Y, value, '' ),
    currentPredicate(X),
    getPredicate(X,Text).

recordChat(Chat,Class) :-
    get_by_id(chatLog, ChatLog ),
    create(p, NewDiv),
    add_class(NewDiv, Class),
    set_html(NewDiv, Chat),
    append_child(ChatLog,NewDiv).

launchPredicate(X,[H|T]) :- 
    member(X,T),
    H.

getPredicate(X,Text) :- 
    launchPredicate(X, [greet(Text), 'greet']);
    launchPredicate(X, [toSeek(Text), 'toSeek']).

toSeek(Text) :- 
    (hasKeywords(['present','value'], Text), calculatePresentValueInit);
    (hasKeywords(['portfolio','volatility'], Text), calculatePortfolioVolatilityInit);
    (isYes(Text), askMore);
    (isNo(Text), sendOff);
    tryAgain.

hasKeywords(Targets, Response):-
    atomic_list_concat(WordList, ' ', Response), % separate response by space separator
    hasKeyWord(Targets, WordList). % check if target included in response

hasKeyWord(A,_) :-
    length(A,0).

hasKeyWord([Target|RestOfWords], WordList) :-
    member(Target,WordList),
    hasKeyWord(RestOfWords,WordList).

askMore :-
    recordChat('Oo! What is it?', prologMessage).

sendOff :-
    userName(X),
    atomic_list_concat(['Okay, see you later, ', X, '!'], Farewell),
    recordChat(Farewell, prologMessage).

tryAgain :-
    userName(X),
    atomic_list_concat([X, ', try typing "present value" or "portfolio volatility."'],Choice1),
    atomic_list_concat(['Not sure I got that ', X, '.'], Choice2),
    random_member(ChosenSentence,[Choice1,Choice2]),
    recordChat(ChosenSentence, prologMessage).

isWord(A,B) :- 
    A == B.

isYes(AStr) :- 
    isWord(AStr, yes);
    isWord(AStr, yeah);
    isWord(AStr, yup);
    isWord(AStr, aight);
    isWord(AStr, alright);
    isWord(AStr, yess).
    
isNo(AStr) :- 
    isWord(AStr, nop);
    isWord(AStr, no);
    isWord(AStr, nah);
    isWord(AStr, 'not at all');
    isWord(AStr, 'sorry, no');
    isWord(AStr, 'dont think so').

calculatePresentValueInit :-
    createTable('get_present_value',['future_stock_price','interest_rate','years_to_wait'], calculatePresentValue),
    recordChat('Anything else you would like to know?', prologMessage).

setDataField(Table, Name) :-
    create(tr,TableRow),
    append_child(Table,TableRow),
    create(td,TableDataLabel),
    set_html(TableDataLabel,Name),
    create(td,TableData),
    create(input,Input),
    set_attr(Input, type, text),
    get_attr(Table, id, RandomID),
    atomic_list_concat([Name,RandomID],FullID),
    set_attr(Input, id, FullID),
    append_child(TableData,Input),
    append_child(TableRow,TableDataLabel),
    append_child(TableRow,TableData).

setSubmit(Table, Predicate) :-
    create(tr,TableRow),
    append_child(Table,TableRow),
    create(td,TableSubmitField),
    create(button,TableSubmitButton),
    get_attr(Table, id, TableID),
    get_attr(Table, class, TableClass),
    set_html(TableSubmitButton, TableClass),
    set_attr(TableSubmitButton, id, TableID),
    bind(TableSubmitButton, click, Event, calculateAnswer(Event,Predicate,TableID)),
    create(td,AnswerField),
    atomic_list_concat(['showAnswer',TableID],AnswerObjID),
    set_attr(AnswerField, id, AnswerObjID),
    append_child(TableSubmitField,TableSubmitButton),
    append_child(TableRow,TableSubmitField),
    append_child(TableRow,AnswerField).

calculateAnswer(Event, Predicate, TableID) :-
    prevent_default( Event ),
    (launchPredicate(Predicate, [calculatePresentValue(TableID), 'calculatePresentValue']);
    launchPredicate(Predicate, [calculatePortfolioVolatility(TableID), 'calculatePortfolioVolatility'])).

atom_num(A,N) :-
    atom_codes(A,PxCode),
    number_codes(N,PxCode).

get_by_uniqueID(Query,TableID,Object):-
    atomic_list_concat([Name,RandomID],FullID),
    get_by_id('future_stock_price',Obj).

calculatePresentValue(TableID) :-
    atomic_list_concat(['future_stock_price',TableID],PtObjID),
    get_by_id(PtObjID, PtField),
    get_attr(PtField,value,PtStr),
    atomic_list_concat(['interest_rate',TableID],RObjID),
    get_by_id(RObjID,RField),
    get_attr(RField,value,RStr),
    atomic_list_concat(['years_to_wait',TableID],YObjID),
    get_by_id(YObjID,YField),
    get_attr(YField,value,YStr),
    atom_num(PtStr,Pt),
    atom_num(RStr,R),
    atom_num(YStr,T),
    Po is Pt/(1+R)^T,
    atomic_list_concat(['showAnswer',TableID],AnswerObjID),
    get_by_id(AnswerObjID,AnswerField),
    set_html(AnswerField,Po).

setDataValue(Table,Variables):-
    length(Variables,0).

setDataValue(Table,[H|T]):-
    setDataField(Table,H),
    setDataValue(Table,T).

createTable(Name,Values,Predicate) :-
    get_by_id(chatLog, DocBody),
    create(table,Table),
    random_between(1,10000,RandomID),
    set_attr(Table, id, RandomID),
    set_attr(Table, class, Name),
    append_child(DocBody,Table),
    setDataValue(Table,Values),
    setSubmit(Table,Predicate).

calculatePortfolioVolatilityInit :-
    createTable('get_portfolio_volatility',['number_of_stocks','correlation_between_stocks','average_stock_volatility'], calculatePortfolioVolatility),
    recordChat('Anything else you would like to know?', prologMessage).

calculatePortfolioVolatility(TableID) :-
    atomic_list_concat(['number_of_stocks',TableID],StockQuantityObjID),
    get_by_id(StockQuantityObjID, StockQuantityField),
    get_attr(StockQuantityField,value,StockQuantityStr),

    atomic_list_concat(['correlation_between_stocks',TableID],StockCorrelationObjID),
    get_by_id(StockCorrelationObjID, StockCorrelationField),
    get_attr(StockCorrelationField,value,StockCorrelationStr),

    atomic_list_concat(['average_stock_volatility',TableID],StockVolatilityObjID),
    get_by_id(StockVolatilityObjID, StockVolatilityField),
    get_attr(StockVolatilityField,value,StockVolatilityStr),

	atom_num(StockQuantityStr, StockQuantity),
    atom_num(StockCorrelationStr, StockCorrelation),
    atom_num(StockVolatilityStr, StockVolatility),

    Covariance is StockCorrelation*StockVolatility*StockVolatility,
    
	PortfolioVariance is ((StockVolatility^2)*(1/StockQuantity)) + ((1-(1/StockQuantity))*Covariance),
	PortfolioVolatility is PortfolioVariance^(1/2),

    atomic_list_concat(['showAnswer',TableID],AnswerObjID),
    get_by_id(AnswerObjID,AnswerField),
    set_html(AnswerField,PortfolioVolatility).

`;

const KB = domKB;

export { KB };