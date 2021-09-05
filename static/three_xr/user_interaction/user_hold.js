import * as THREE from 'three';
import $ from 'jquery';

function getColorWEBGL(augmented_environment) {
    const domElement = augmented_environment.renderer.domElement;
    const gl = domElement.getContext('webgl2');
    const x = gl.drawingBufferWidth/2;
    const y = gl.drawingBufferHeight/2;
    var pixels = new Uint8Array(
        4 * gl.drawingBufferWidth * gl.drawingBufferHeight
    );
    gl.readPixels(
        0,
        0,
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
    );
    var pixelR = pixels[4 * (y * gl.drawingBufferWidth + x)];
    var pixelG = pixels[4 * (y * gl.drawingBufferWidth + x) + 1];
    var pixelB = pixels[4 * (y * gl.drawingBufferWidth + x) + 2];
    augmented_environment.edit_class.brush.paintColor = `rgb(${pixelR},${pixelG},${pixelB})`
}

function getColor(augmented_environment) {
    const webcam = document.querySelector("#webcam")
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    var pixel = context.getImageData(canvas.width/2, canvas.height/2, 1, 1).data;
    augmented_environment.edit_class.brush.paintColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
}

function paint(augmented_environment){
    const brush = augmented_environment.edit_class.brush;
    const geometry = new THREE.SphereGeometry( brush.width, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: brush.paintColor } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(0,0,-1).applyMatrix4( augmented_environment.controller.matrixWorld );
    augmented_environment.scene.add(sphere);
}

function startPaint(augmented_environment){
    augmented_environment.edit_class.is_painting = true;
    $("body").on('click',() => {
        getColor(augmented_environment);
    });
}

function endPaint(augmented_environment){
    augmented_environment.edit_class.is_painting = false;
}

function dragObject(augmented_environment) {
    augmented_environment.edit_class.dragged_object.position.set(0, 0, - 1).applyMatrix4( augmented_environment.controller.matrixWorld );
    augmented_environment.edit_class.dragged_object.quaternion.setFromRotationMatrix( augmented_environment.controller.matrixWorld );
} 

function startObjectReposition(augmented_environment){
    if (augmented_environment.intersects.length) {
        for (var i = 0; i < augmented_environment.intersects.length; i++){
            if(augmented_environment.intersects[i].object.userData.markerID){
                augmented_environment.edit_class.is_repositioning = true;
                augmented_environment.edit_class.dragged_object = augmented_environment.intersects[i].object;
                break
            } 
        }}
}

function endObjectReposition(augmented_environment){
    augmented_environment.edit_class.is_repositioning = false;
}

function addControllerDragEvents(augmented_environment){

    augmented_environment.controller.addEventListener("selectstart",function(){
        
        if (augmented_environment.edit_class.can_reposition_objects){
            startObjectReposition(augmented_environment);
        } else if (augmented_environment.edit_class.can_paint){
            startPaint(augmented_environment);
        }
    });
    
    augmented_environment.controller.addEventListener("selectend",function(){

        if (augmented_environment.edit_class.can_reposition_objects){
            endObjectReposition(augmented_environment)
        } else if (augmented_environment.edit_class.can_paint){
            endPaint(augmented_environment);
        }

    })
};

export { dragObject, paint, addControllerDragEvents };