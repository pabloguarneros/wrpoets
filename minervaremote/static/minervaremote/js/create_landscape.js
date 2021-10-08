import $ from 'jquery';
import {BasicCharacterController} from "./protagonist.js";


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

        this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );
        this._controls.enablePan = false;
        this._controls.enableZoom = false;
        this._controls.target.set( 0, 1, 0 );
        this._controls.update();

        this._scene.fog = new THREE.Fog( 0x9EE482, 10, 50 );

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        this._scene.add( hemiLight );

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(4, 1, 8);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 50;
        light.shadow.camera.right = -50;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        this._scene.add(light);

        const groundGeometry = new THREE.PlaneGeometry( 20000, 20000, 128, 128);
        groundGeometry.rotateX( - Math.PI / 2 );
        const groundMaterial = new THREE.MeshPhongMaterial( { color: 0x87DF9E, depthWrite: false} );
        const ground = new THREE.Mesh( groundGeometry, groundMaterial );
        ground.receiveShadow = true;
        this._scene.add( ground );

        this._mixers = [];
        this._previousAnimation = null;
    
        this._LoadAnimatedModel();
        this._animate();

    }

        _LoadAnimatedModel() {
            const params = {
            camera: this._camera,
            scene: this._scene
            //gltfloader: this._gltfloader
        }

            this._controls = new BasicCharacterController(params);
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
        
            if (this._controls) {
              this._controls.Update(timeElapsedS);
            }
          }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
   _APP = new WelcomeDemo() 
})