import $ from 'jquery';
import { PaintCanvas } from "../paint/create_environment.js"
import { buildCubicBezierCurve } from "./curves.js";

var bubble_positions = [];

$(document).ready(function(){
    const three_canvas = new PaintCanvas();
    renderCanvas(three_canvas);
});

function padLog(message){
    $("#fake_console").append(`<p>${message}</p>`);
}

function createSphere(three_canvas, position){
    
    const material = new THREE.MeshLambertMaterial({
            color: 0x171717,
            emissive: 0x00000 });

    const geometry = new THREE.SphereGeometry( 1.6, 5, 5 );

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(position.x, position.y, position.z);

    bubble_positions.push(position);
    three_canvas.scene.add(mesh);

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
    padLog(bezier_x);
    padLog(bezier_y);
    const points = [];
    bezier_x.map( function(e,i) {
        points.push( new THREE.Vector3( e, bezier_y[i], 0) );
    })
    /*bubble_positions.forEach((p)=>{
        points.push( new THREE.Vector3( p.x, p.y, 0) );
    }); */

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
                    padLog(normals.y)
    return normals
}

function getScenePosition(x,y){
    let resize_scale = (window.screen.height > window.screen.width)
                        ? (window.screen.width/window.screen.height)
                        :(window.screen.height/window.screen.width)
    resize_scale *= 100;
    const scene_x = resize_scale * (2*x-1);
    const scene_y = ( 95 * y - 50);
    const scene_z = -104;

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
    console.log(raycaster);
    const r_x = raycaster.ray.direction.x*(80);
    const r_y = raycaster.ray.direction.y*(80);
    const r_z = -104;
    createSphere(three_canvas, {x: r_x, y: r_y, z: r_z});
}

function renderCanvas(three_canvas){
    
    /* document.addEventListener('mousedown',
        (target) => onTap(target, three_canvas)); */

    $("body").on('touchmove', function (event)  {
        if (event.touches){
            for (let i = 0; i < event.touches.length; i++){
                const tip = event.touches.item(i);
                if (tip.touchType == "stylus"){
                    const normals = normalizePositionInput(tip.screenX, tip.screenY)
                    const scenePosition = getScenePosition(normals.x, normals.y);
                    createSphere(three_canvas, scenePosition);
                }
            }
        } else  {
            $("#user_instructions").html = "Sorry, this browswer is not compatible";
        }})
        
        document.getElementById("draw_line").addEventListener("click",function(){
            createLine(three_canvas)
        });

    }