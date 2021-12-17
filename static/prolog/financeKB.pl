% concat from https://stackoverflow.com/questions/4708235/concatting-a-list-of-strings-in-prolog

concat([ ], Empty) :-
    string_to_list(Empty,[ ]).

concat([H|T], StrCat) :-
    concat(T,H,StrCat).

concat([ ],StrCat,StrCat).

concat([H|T],Str,Cat) :-
    string_to_list(Sep,"\n\n"),
    string_concat(Sep,H,SepH),
    string_concat(Str,SepH,StrSepH),
    concat(T,StrSepH,Cat).

number_term(Num, At) :-
    atom_string(At, AtStr),
    number_string(Num, AtStr).

isWord(A,B) :- 
    A == B.

isYes(A) :- 
    atom_string(A,AStr),
	isWord(AStr, "yes");
	isWord(AStr, "yeah");
	isWord(AStr, "yup");
	isWord(AStr, "aight");
	isWord(AStr, "alright");
	isWord(AStr, "yess").

isNo(A) :- 
    atom_string(A,AStr),
	isWord(AStr, "nop");
	isWord(AStr, "no");
	isWord(AStr, "nah");
	isWord(AStr, "not at all");
	isWord(AStr, "sorry, no");
	isWord(AStr, "don’t think so").
	
getValue(A, Px) :-
	concat(["Do you have", A, "?"], QuestionOne),
	ask(QuestionOne, YesNo),
	isYes(YesNo),
	concat(["What is", A, "?"], QuestionTwo),
	ask(QuestionTwo, Px).

ensureConstraint(A, B) :-
	concat(["Is", A, B, "?"], QuestionOne),
	ask(QuestionOne, X),
	isYes(X).

tryAgain :-
	alertUser("Oh, but we needed that"),
    ask("Anything else you would like to know?", A),
    getPredicate(A).

calculatePresentValue() :-
	getValue("the future value", PxStr),
	getValue("the interest rate", RStr),
	getValue("the number of years", TStr),
    number_term(Px, PxStr),
    number_term(R, RStr),
    number_term(T, TStr),
    Po is Px/(1+R)^T,
    number_string(Po, PoStr),
    concat(["Your present value is", PoStr,"."], Answer),
	alertUser(Answer).

calculatePresentValue() :-  % when the person didn’t have the required quantities
	tryAgain.

calculatePortfolioVolatility() :-
	ensureConstraint("your portfolio", "equally_weighted"),
	getValue("the number of stocks in your portfolio", StockQuantityStr),
	getValue("correlation between your stocks", StockCorrelationStr),
	getValue("the average volatility (or standard deviation) of your stocks", StockVolatilityStr),
	number_term(StockQuantity, StockQuantityStr),
    number_term(StockCorrelation, StockCorrelationStr),
    number_term(StockVolatility, StockVolatilityStr),
    Covariance is StockCorrelation*StockVolatility*StockVolatility,
	PortfolioVariance is (StockCorrelation^2)*(1/StockQuantity) + (1-(1/StockQuantity))*Covariance,
	sqrt(PortfolioVariance, PortfolioVolatility),
    number_string(PortfolioVolatility, PortfolioVolatilityStr),
    concat(["Your portfolio’s volatility is", PortfolioVolatilityStr,"."], Answer),
	alertUser(Answer).
	
calculatePortfolioVolatility() :-
	tryAgain.

startProgram() :-
	alertUser("Hello, I’m Fini!"),
	ask("What's your name, future finance wizz?", CustomerName),
	concat(["Well,", CustomerName, "it's pleasure to embark on this learning quest with you!"], Sentence),
	alertUser(Sentence),
	ask("What do you want to know?", A),
    getPredicate(A).

noAnswer :-
	alertUser("Agh, I don’t know how to answer that!"),
	ask("How about we try calculating the present value of a stock or the volatility of a portfolio?", Answer),
	Answer == "yes".	

launchPredicate(X,[H|T]) :-
    member(X,T),
    H.

getPredicate(X) :- 
    atom_string(X,XStr),
    launchPredicate(XStr, [calculatePortfolioVolatility(), "portfolio volatility"]);
    launchPredicate(XStr, [calculatePresentValue(), "present value"]);
    tryAgain.


