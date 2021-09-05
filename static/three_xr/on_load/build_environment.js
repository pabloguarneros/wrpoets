import * as THREE from 'three';
import $ from "jquery";
import loadImages from './load_images.js';
import ARButton from '../ARButton.js';
import AR_Edit from '../user_interaction/AR_edit.js';
import { save_edit } from '../user_interaction/save_data.js';
import { dragObject, paint, addControllerDragEvents } from '../user_interaction/user_hold.js';
import { display_text } from '../user_interaction/user_tap.js';

class Augmented_Environment{

    constructor(feature, scope){
        this.scene = new THREE.Scene();
        this.edit_class = new AR_Edit();
        this.controller;
        this.renderer;
        this.font;
        this.feature = feature;
        this.imageData = [];
        this.markerData = [];
        this.scope = scope;
        this.intersects = [];
    };

    build(){
        
        const augmented_environment = this;

        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

        augmented_environment.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        augmented_environment.renderer.setSize(window.innerWidth, window.innerHeight);
        augmented_environment.renderer.setPixelRatio(window.devicePixelRatio);
        augmented_environment.renderer.xr.enabled = true;

        const raycaster = new THREE.Raycaster();

        augmented_environment.controller = augmented_environment.renderer.xr.getController(0);
        augmented_environment.scene.add(augmented_environment.controller);

        $("#augmented_canvas").append( augmented_environment.renderer.domElement );

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        light.position.set(0.5, 1, 0.25);
        augmented_environment.scene.add(light);

        const fontLoader = new THREE.FontLoader()
        fontLoader.load(
            '/static/js/fonts/helvetiker_regular.typeface.json',
            function(helvetiker){
                augmented_environment.font = helvetiker;
            })

        // at load
        switch (augmented_environment.feature) {

            case "images":
                async function get_images(){
                    const api = `/nubes/nodes/${window.location.href.substring(window.location.href.lastIndexOf('/') + 1)}`;
                    fetch(api)
                    .then( response => response.json() )
                    .then( function(imageData){
                        augmented_environment.imageData = imageData;
                        loadImages(augmented_environment)
                    });
                }
                get_images();
                
        };

        document.body.appendChild(ARButton.createButton(augmented_environment.renderer));

        animate();

        $("#ARButton").on("click", () => {
            switch (augmented_environment.feature + '|' 
                    + augmented_environment.scope){
                case "images|edit":
                    $("svg").replaceWith("<div id='object_found_indicator'><button id='save_edit'>save</button></div>");
                    $("#save_edit").on('click', ()=>{ save_edit(augmented_environment) })
                    addControllerDragEvents(augmented_environment);
                    break
                case "images|explore":
                    $("svg").replaceWith("<div id='object_found_indicator'></div>");
                    $("body").on("click",function(){
                        display_text(augmented_environment)
                        });
                    break
            }
        })

        function animate(){
            augmented_environment.renderer.setAnimationLoop(render);
        }

        function render() {

            var cameraPosition = new THREE.Vector3();
            var cameraDirection = new THREE.Vector3();
            
            camera.getWorldPosition(cameraPosition);
            camera.getWorldDirection(cameraDirection);
        
            raycaster.set(cameraPosition,cameraDirection );
                
            augmented_environment.intersects = raycaster.intersectObjects(augmented_environment.scene.children);
        
            if (augmented_environment.intersects.length) {
                for (var i = 0; i < augmented_environment.intersects.length; i++){
                    if( augmented_environment.intersects[i].object.userData.markerID ){ objectFound() }
                };
            } else { objectNotFound() }
            
            function objectFound(){
                $("#object_found_indicator").css("border-color","#FBD748");
            }
            function objectNotFound(){
                $("#object_found_indicator").css("border-color","#47297B");
            }

            // at render
            switch (augmented_environment.scope){
                case "edit":
                    if (augmented_environment.edit_class.is_repositioning){
                        dragObject(augmented_environment) 
                    } else if (augmented_environment.edit_class.is_painting){
                        paint(augmented_environment)
                    };
            }
            augmented_environment.renderer.render(augmented_environment.scene, camera);
        }

        window.addEventListener( 'resize', onWindowResize, false );
            
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            augmented_environment.renderer.setSize( window.innerWidth, window.innerHeight );
        }

    }
}

export {Augmented_Environment};