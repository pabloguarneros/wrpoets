import $ from "jquery"
import { loadCamera } from "../load_camera.js"
import { ThreeCanvas } from "../three/create_environment.js"

$(document).ready(function(){
    const three_canvas = new ThreeCanvas();
    loadCamera("#user_video",three_canvas);
});
