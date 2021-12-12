%  Tell prolog that known/3 and multivalued/1 will be added later
:- dynamic known/3, multivalued/1.

% Enter your KB below this line:

multivalued(covid).
multivalued(outfit).

categoricalChoice(price).
categoricalChoice(mood).
categoricalChoice(energy).

club(sleep) :-
    yes_no(instruct,_,Y),
    Y \== yes.
    
club(stattbad) :- 
    (covid(vaccinated); covid(recovered)),
    \+population(high_risk),
    \+abroad(past_month),
    mask(ffptwo),
    \+residence(close),
    (price(twelve);price(fifteen)),
    (energy(mid); mood(chill)).

club(katerholzig) :- (covid(vaccinated); covid(recovered)),
    \+population(high_risk),
    \+abroad(past_month),
    mask(ffptwo),
    residence(close),
    price(fifteen),
    outfit(colorful),
    speaker(german),
    (energy(mid); energy(low)).

club(sisyphos) :- (covid(vaccinated); covid(recovered)),
    \+population(high_risk),
    \+abroad(past_month),
    mask(ffptwo),
    \+residence(close),
    (price(ten);price(twelve);price(fifteen)),
    \+group(big),
    (mood(chill); mood(happy); energy(low)).

club(salon_zur_wilden_renate) :- (covid(vaccinated); covid(recovered)),
    \+population(high_risk),
    \+abroad(past_month),
    mask(ffptwo),
    \+residence(close),
    (price(ten);price(twelve);price(fifteen)),
    speaker(german),
    \+group(big),
    mood(wild).

club(kitkat) :- (covid(vaccinated); covid(recovered)),
    \+population(high_risk),
    \+abroad(past_month),
    mask(ffptwo),
    residence(close),
    (price(ten);price(twelve);price(fifteen)),
    outfit(sexy),
    (mood(sexual); energy(high)). 

club(chalet) :- (covid(vaccinated); covid(recovered)),
    \+population(high_risk),
    \+abroad(past_month),
    mask(ffptwo),
    residence(close),
    (price(ten);price(twelve);price(fifteen)),
    speaker(german),
    (mood(chill); energy(mid)).

club(about_blank) :- (covid(vaccinated); covid(recovered)),
    \+population(high_risk),
    \+abroad(past_month),
    mask(ffptwo),
    \+residence(close),
    (price(ten);price(twelve);price(fifteen)),
    \+group(big),
    \+volume(loud),
    \+outfit(fancy),
    (mood(chill); energy(high)).

club(stattbad) :- (covid(vaccinated); covid(recovered)),
    \+population(high_risk),
    \+abroad(past_month),
    mask(ffptwo),
    \+residence(close),
    (price(ten);price(twelve);price(fifteen)),
    (energy(mid); mood(chill)).

% The code below implements the prompting to ask the user:

covid(X) :- ask(covid, X). % multivalued
population(X) :- ask(population, X).
abroad(X) :- ask(abroad, X).
mask(X) :- ask(mask, X).
residence(X) :- ask(residence, X).
outfit(X) :- ask(outfit, X). % multivalued
speaker(X) :- ask(speaker,X).
volume(X) :- ask(volume, X).
group(X) :- ask(group, X).
price(X) :- ask(price, X).
mood(X) :- ask(mood, X).
energy(X) :- ask(energy, X).

% Asking clauses

ask(A, V):-
    known(yes, A, V), % succeed if true
    !.      % stop looking

ask(A, V):-
    known(_, A, V), % fail if false
    !, fail.

% If not multivalued, and already known to be something else, dont ask again for a different value.

ask(A, V):-
    \+multivalued(A),
    known(yes, A, V2), % fail if has another value
    V \== V2, % which is not the same value
    !, fail.

ask(A, V):-
    categoricalChoice(A),
    yes_no(A,V,Y), % get the answer
    assertz(known(yes, A, Y)), % remember it
    V == Y. % succeed or fail

ask(A, V):-
    \+categoricalChoice(A),
    yes_no(A,V,Y), % get the answer
    assertz(known(Y, A, V)), % remember it
    Y == yes.       % succeed or fail
