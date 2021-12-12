import $ from 'jquery';
import { PaintCanvas } from "../paint/paintCanvas.js"
import { buildCubicBezierCurve } from "./curves.js";

var bubble_positions = [];
var pDrag = { x:0, y:0 };
const material = new THREE.MeshBasicMaterial({color: 0xE27396});
const geometry = new THREE.CircleGeometry( 0.5, 10 );

$(document).ready(function(){
    const three_canvas = new PaintCanvas();
    renderCanvas(three_canvas);
});


function createSpheres(three_canvas, position){

    const mesh = new THREE.Mesh(geometry, material);
    for (let _ = 0; _ < 40; _++){
        mesh.position.set(
            position.x + (Math.random()*0.8 - 0.4),
            position.y + (Math.random()*0.8 - 0.4),
            position.z + (Math.random()*0.8 - 0.4));
        bubble_positions.push(position);
        three_canvas.scene.add(mesh);
    }

}

function createLine(three_canvas){

    const lineMaterial = new THREE.LineBasicMaterial( {
        color: 0x0fff02,
        linewidth: 40,
        vertexColors: true,
                dashed: false,
        alphaToCoverage: true,
    } );

    
    function choose4Points(pointArray, component="x"){
        const A = pointArray[0];
        const B = pointArray[Math.ceil(pointArray.length*0.25)];
        const C = pointArray[Math.floor(pointArray.length*0.75)];
        const D = pointArray[pointArray.length-1];
        switch (component){
            case "x":
                return [A.x, B.x, C.x, D.x]
            case "y":
                return [A.y, B.y, C.y, D.y]
        }; 
    }
    const bezier_x = buildCubicBezierCurve(choose4Points(bubble_positions, "x"));
    const bezier_y = buildCubicBezierCurve(choose4Points(bubble_positions, "y"));
    const points = [];
    bezier_x.map( function(e,i) {
        points.push( new THREE.Vector3( e, bezier_y[i], 0) );
    })

    const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( lineGeometry, lineMaterial );
    line.position.z = -120; 
    line.scale.set( 1, 1, 1 );
    three_canvas.scene.add(line);

}

function normalizePositionInput(x,y){

    const normals = (window.screen.height < window.screen.width)
                    ? {x: x/window.screen.width, y: 1-y/window.screen.height}
                    : {x: x/window.screen.height, y: 1-y/window.screen.width}
    return normals
}

function getScenePosition(three_canvas, x,y){
    let resize_scale = (window.screen.height > window.screen.width)
                        ? (window.screen.width/window.screen.height)
                        :(window.screen.height/window.screen.width)
    resize_scale *= 100;
    const pCamera =three_canvas.controls.camera.position
    const scene_x = resize_scale * (2*x-1) + pCamera.x;
    const scene_y = ( 95 * y - 50) + pCamera.y;
    const scene_z = pCamera.z - 104;

    return {x: scene_x, y: scene_y, z: scene_z}
}

function onTap(e, three_canvas){
    e.preventDefault();
    const mouse3D = new THREE.Vector3(
        ( e.screenX / window.screen.width) * 2 -1,
        -( e.screenY / window.screen.height ) * 2 -1,
        0.5)
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse3D, three_canvas.camera);
    const r_x = raycaster.ray.direction.x*(80);
    const r_y = raycaster.ray.direction.y*(80);
    const r_z = -104;
    createSpheres(three_canvas, {x: r_x, y: r_y, z: r_z});
}

function renderCanvas(three_canvas){

    $("body").on('touchstart',function(event) {
        pDrag = { x:0, y:0 };
    });
    $("body").on('touchmove', function (event)  {
        console.log(
            three_canvas.controls.camera.position.x,
            three_canvas.controls.camera.position.y);
        if (event.touches){
            for (let i = 0; i < event.touches.length; i++){
                const tip = event.touches.item(i);
                if (tip.touchType == "stylus"){
                    const normals = normalizePositionInput(tip.screenX, tip.screenY)
                    const scenePosition = getScenePosition(three_canvas, normals.x, normals.y);
                    createSpheres(three_canvas, scenePosition);
                }else{ // is finger
                    if (pDrag.x == 0 & pDrag.y == 0){
                        pDrag.x = tip.clientX;
                        pDrag.y = tip.clientY;
                    } else {
                        const pUpdate = {x:0,y:0}
                        pUpdate.x = (pDrag.x < tip.clientX) ? 0.5 : -0.5;
                        pUpdate.y = (pDrag.y > tip.clientY) ? 0.5 : -0.5;
                        three_canvas.controls.update(0,pUpdate,"xy")
                    console.log(pUpdate);
                    }
                }
            }
        } else  {
            $("#user_instructions").html = "Sorry, this browswer is not compatible";
        }})
        
    }