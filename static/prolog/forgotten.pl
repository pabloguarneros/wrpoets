
join_str(Str1, Str2, Str3) :- 
    name(Str1, StrList1),
    name(Str2, StrList2),
    append(StrList1, StrList2, StrList3),
    name(Str3, StrList3).

isWord(X, Y) :-
	X == [],
	Y == [].

isWord( [Hx|Tx] , [Hy,Ty] ) :-
	string_length(Tx, Ty);
	string_lower(Hx, XLowerCase),
	string_lower(Hy, XLowerCase),
	isWord(Tx,Ty).