import $ from "jquery"
import { loadCamera } from "../load_camera.js"
import { PaintCanvas } from "./paintCanvas.js"

$(document).ready(function(){
    const paintCanvas = new PaintCanvas();
    loadCamera("#user_video", paintCanvas);
});
