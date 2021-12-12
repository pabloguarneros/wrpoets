:- dynamic world/1.

world(flat).

isHelpful(finance, project_valuation). % X is helpful doing Y
isDefinition(balanceSheet, "firm's current financial status").
isDefinition(arbitrage, "set of trades that yiels positive cashflow in all dates").
hasMyth(arbitrage, "quantity of positive cashflow in the future is certain").
hasMyth(arbitrage, "necessary for all market participants to remove arbitrage opportunities").

canAffect(magnitude, cash_flow_valuation). % X can affect Y
canAffect(timing, cash_flow_valuation). % X can affect Y
canAffect(risk, cash_flow_valuation). % X can affect Y

start :-
    yes_no("Want to find a night club? Swipe left for yes. Swipe right for no."),
    story_time.

start :-
    yes_no("Ookay, so be it"); resolve.

story_time :-
    yes_no("Can I tell you a story?"),
    yes_no("Of how things should be?"),
    yes_no("Will You Be Honest?"),
    assertz(world(round)),
    yes_no("Okay, now breathe.").
