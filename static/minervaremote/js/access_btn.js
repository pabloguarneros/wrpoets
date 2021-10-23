import $ from 'jquery';
function character_has_loaded(){
    $("#enter_elsewhere_btn").addClass("reveal");
    $("#enter_elsewhere_btn").on('click',function(){
        $("#interaction_toggles").css("display","flex");
        $("#remote_intro").addClass("fade");
        $("#remote_intro").on("animationend",function(){
            $("#interaction_toggles").css("display","flex");
            $("#remote_intro").css("display","none");
        })
    });
}
export {character_has_loaded}
