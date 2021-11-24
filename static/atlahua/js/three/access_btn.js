import $ from 'jquery';

function character_has_loaded(){
    $("#enter_3D_world").addClass("reveal");
    $("#enter_3D_world").on('click',function(){
        $("#loading_page").addClass("fade");
        $("#loading_page").on("animationend",function(){
            $("#loading_page").css("display","none");
        })
    });
}
export {character_has_loaded}
