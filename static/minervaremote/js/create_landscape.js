import $ from 'jquery';
import { BasicCharacterController } from "./protagonist.js";
import { ViewControl } from './view_control.js';
import { create_lights } from './create_lights.js';
import { create_ground } from './create_ground.js';
import { load_models } from './load_models.js';

class WelcomeDemo {

    constructor(){
        this._Initialize()
    }

    _Initialize(){
        this._renderer = new THREE.WebGLRenderer( {
            antialias: true, alpha:true } );
        this._renderer.outputEncoding = THREE.sRGBEncoding;
        this._renderer.shadowMap.enabled = true;
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.setSize( window.innerWidth, window.innerHeight );

        $("#3d_world").append( this._renderer.domElement );
        window.addEventListener('resize', () => {
            this._onWindowResize();
          }, false);
        
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
        this._camera.position.set( -8, 9.3, 8 );
        this._clock = new THREE.Clock();  

        this._controls = new ViewControl( this._camera, this._renderer.domElement );
        this._controls.set_settings();

        this.models_to_explore = [];
        this.is_touching_model = false;
        this.currentWindow = "";

        this._mixers = [];
        this._previousAnimation = null;
    
        this._protagonist = new BasicCharacterController({
                                camera: this._camera, scene: this._scene})
        
        create_lights(this._scene);

        create_ground(this._scene);

        this._animate();


        load_models(this._scene, this.models_to_explore);
        
        }

        _onWindowResize() {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize( window.innerWidth, window.innerHeight );
        }

        _animate() {
            requestAnimationFrame((t) => {
              if (this._previousAnimation === null) {
                this._previousAnimation = t;
              }
        
              this._animate();
              this._renderer.render(this._scene, this._camera);
              this._Step(t - this._previousAnimation);
              this._previousAnimation = t;
            });
          }
        
          _Step(timeElapsed) {
            const timeElapsedS = timeElapsed * 0.001;
            if (this._mixers) {
              this._mixers.map(m => m.update(timeElapsedS));
            }
        
            if (this._protagonist._target) {
              this._protagonist.Update(timeElapsedS);

              const position = this._protagonist._target.position;
              this._controls.update(timeElapsedS, position);

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
                      $(this.currentWindow).css("display","flex");
                    };
                    break;
                  } else{
                    if (this.is_touching_model & model.div_ID == this.currentWindow){
                      $(this.currentWindow).css("display","none");
                      this.is_touching_model = false;
                    };
                  }
              }
            }
          }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
   _APP = new WelcomeDemo() 
})