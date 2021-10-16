import $ from 'jquery';
function loaded_triggered(){
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
export {loaded_triggered}
