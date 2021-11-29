import $ from 'jquery';

function character_has_loaded(){
    $("#enter_3D_world").addClass("reveal");
    $("#enter_3D_world").on('click',function(){
        $("#loading_page").addClass("fade");
        setTimeout(function() {
            document.getElementById('beginning_instructions_bg').classList.add("disappear");
        }, 14500);
        setTimeout(function() {
            document.getElementById('beginning_instructions_bg').classList.add("move_right");
        }, 5500);
        $("#loading_page").on("animationend",function(){
            $("#loading_page").css("display","none");
        })
    });
}
export {character_has_loaded}
