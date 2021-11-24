import $ from 'jquery';
import { BasicCharacterController } from "./protagonist.js";
import { ViewControl } from './view_control.js';
import { create_lights } from './create_lights.js';
import { create_ground } from './create_ground.js';
import { render_physics } from './render_physics.js';

class Scene {

    constructor(colors, physics_world=null){
        this.colors = colors;
        this.world = physics_world;
        this.Initialize()
    }

    Initialize(){
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
        this.camera.position.set( -8, 9.3, 8 );
        this.clock = new THREE.Clock();  

        this.controls = new ViewControl( this.camera, this.renderer.domElement );
        this.controls.set_settings();

        this.models_to_explore = [];
        this.physics_objects = [];
        this.is_touching_model = false;
        this.currentWindow = "";
    
        $("#loading_bar").css("width",`${10}%`);
        $("#percentage").html(`10%`)
        $("#3d_world").append( this.renderer.domElement );

        this.mixers = [];
        this.previousAnimation = null;
    
        this.protagonist = new BasicCharacterController({
              camera: this.camera, scene: this.scene })

        window.addEventListener('resize', () => { this.onWindowResize() }, false);
            
        create_lights(this.scene,this.colors);
        create_ground(this.scene, this.colors);

        this.animate();
        
        }

        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }

        animate() {
            requestAnimationFrame((t) => {
              if (this.previousAnimation === null) {
                this.previousAnimation = t;
              }
        
              this.animate();
              this.renderer.render(this.scene, this.camera);
              this.Step(t - this.previousAnimation);
              this.previousAnimation = t;
            });
          }
        
          Step(timeElapsed) {
            const delta = timeElapsed * 0.001;
            if (this.mixers) {
              this.mixers.map(m => m.update(delta));
            }
            /*if (this.world){
              render_physics(this.world, this.physics_objects, delta);
            }*/
            if (this.protagonist._target) {
              this.protagonist.Update(delta);

              const position = this.protagonist._target.position;
              this.controls.update(delta, position);

              for (var i = 0; i < this.models_to_explore.length; i ++){
                const model = this.models_to_explore[i];
                if ( (model.x_range[0] < position.x) &&
                      (model.x_range[1] > position.x) &&
                      (model.z_range[0] < position.z) &&
                      (model.z_range[1] > position.z)
                  ){
                    if (!this.is_touching_model){
                      this.currentWindow = model.div_ID;
                      this.is_touching_model = true;
                      $(this.currentWindow).removeClass("hide").addClass("reveal");
                    };
                    break;
                  } else{
                    if (this.is_touching_model & model.div_ID == this.currentWindow){
                      $(this.currentWindow).removeClass("reveal").addClass("hide");
                      this.is_touching_model = false;
                    };
                  }
              }
            }
          }
}

export {Scene};