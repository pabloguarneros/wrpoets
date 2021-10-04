import $ from "jquery";
import {Augmented_Environment} from "../../../../../static/three_xr/on_load/build_environment.js";
import {loadCamera} from "../../../../../static/three_xr/on_load/load_camera.js";

$( document ).ready(function() {
    const environment = new Augmented_Environment("images", "edit");
    loadCamera().then( () => {
        $("body").on("click",function(){
            const webcam = document.querySelector("#webcam")
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = window.screen.width;
            canvas.height = window.screen.height;
            context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
            var pixel = context.getImageData(canvas.width/2, canvas.height/2, 1, 1).data;
            $("#alert").css("color",`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`)
            $("#augmented_canvas").css("opacity",`0`)
            $("#alert").html(`${webcam}`)
            $("#save_edit").html(`${webcam.srcObject}}`)
            $("#webcam").css("background-color",`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`)
    })
        environment.build();
    });
    
 });