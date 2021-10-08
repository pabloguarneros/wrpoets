import $ from 'jquery';
import {BasicCharacterController} from "./protagonist.js";
import {ModelLoad} from './model_class.js';
import {ViewControl} from './view_control.js';
import { create_lights } from './create_lights.js';
import { create_ground } from './create_ground.js';

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

        $("body").append( this._renderer.domElement );
        window.addEventListener('resize', () => {
            this._onWindowResize();
          }, false);
        
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
        this._camera.position.set( -8, 9.3, 12 );
        this._clock = new THREE.Clock();  

        this._controls = new ViewControl( this._camera, this._renderer.domElement );
        this._controls.set_settings();

        create_lights(this._scene);

        create_ground(this._scene);

        this._mixers = [];
        this._previousAnimation = null;
    
        this._protagonist = new BasicCharacterController({
                                camera: this._camera, scene: this._scene})
        
        this._animate();

        const greenhouse = new ModelLoad("static/models/greenhouse/scene.gltf");
        greenhouse.add_to_scene(this._scene,
                            {'gui':false,
                            'r':{'x':0,'y':5,'z':0},
                            'p':{'x':5,'y':0,'z':-31},
                            's':{'x':4,'y':4,'z':4}}); 

        const map = new ModelLoad("static/models/map/scene.gltf");
        map.add_to_scene(this._scene,
                        {'gui':false,
                        'r':{'x':0,'y':0,'z':0}, //rotation
                        'p':{'x':16,'y':0,'z':0}, // position
                        's':{'x':1.6,'y':1.6,'z':1.6}});  // scale
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
              this._controls.update(timeElapsedS, this._protagonist._target.position);
            }
          }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
   _APP = new WelcomeDemo() 
})