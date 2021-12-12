import $ from 'jquery';
import { ViewControl } from './view_control.js';
import { create_lights } from './create_lights.js';
import { loadGestures } from "./paintGestures.js";

class PaintCanvas {

    constructor(){
        this.initialize()
        this.loadGestures = this.loadGestures.bind(this);
    }

    initialize(){

        this.resize_scale = (document.documentElement.clientWidth/document.documentElement.clientHeight)*50;
        this.threejsDiagonal = Math.sqrt(115**2+( //y in three.js is 115 as a width
          (document.documentElement.clientWidth/document.documentElement.clientHeight)*100)**2);

        this.renderer = new THREE.WebGLRenderer( {
            antialias: true, alpha:true } );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        $("#three_canvas").append( this.renderer.domElement );
        window.addEventListener('resize', () => {
            this.onWindowResize();
          }, false);
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 60, 300 );
        this.video = null;
        this.controls = new ViewControl( this.camera, this.renderer.domElement );
        this.controls.set_settings();
        this.currentCursor = [0,0];

        create_lights(this.scene);

        this.animationObjects = [];

        this.animate();

        }

        loadGestures(){
          loadGestures(this.video, this);
        }

        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }

        animate() {
            requestAnimationFrame((t) => {
              this.animate();
              this.renderer.render(this.scene, this.camera);
              this.controls.update(t,0);
              /*this.animationObjects.forEach(mesh => {
                if (mesh.userData.clock && mesh.userData.mixer) {
                  mesh.userData.mixer.update(mesh.userData.clock.getDelta());
                }
              });*/
            });
          }
}

export { PaintCanvas };