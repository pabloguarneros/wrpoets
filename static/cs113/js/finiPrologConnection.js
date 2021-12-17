import $ from 'jquery';
import {KB} from './financeKB.js'

var session = pl.create(1000);

function query(session, value){
    session.query('init.', { success: function(goal) {
        session.answer( x => '' )
    },
    error: function(err) { console.log(pl.format_answer(err)) }
});
}

$(document).ready(function(){
    $("#userInput").on('mouseOver',function(){
        const chatDiv = document.getElementById("chatLog");
        chatDiv.scrollTop = chatDiv.scrollHeight;
    });
    session.consult(KB, {
        success: function() {
            query(session, "apple");
        },
        error: function(err) { console.log(pl.format_answer(err)) }
        });
})
