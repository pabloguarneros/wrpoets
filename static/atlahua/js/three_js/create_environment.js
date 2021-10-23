import $ from 'jquery';
import { ViewControl } from './view_control.js';
import { create_lights } from './create_lights.js';

class ThreeCanvas {

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

        $("#three_canvas").append( this._renderer.domElement );
        window.addEventListener('resize', () => {
            this._onWindowResize();
          }, false);
        
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );

        this._controls = new ViewControl( this._camera, this._renderer.domElement );
        this._controls.set_settings();

        create_lights(this._scene);


        const geometry = new THREE.SphereGeometry( 15, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(0,0,-100);
        this.sphere = sphere;
        this._scene.add( this.sphere );

        this._animate();

        }

        _onWindowResize() {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize( window.innerWidth, window.innerHeight );
        }

        _animate() {
            requestAnimationFrame((t) => {
              this._animate();
              this._renderer.render(this._scene, this._camera);
              this._controls.update(t);

            });
          }
}

export {ThreeCanvas};