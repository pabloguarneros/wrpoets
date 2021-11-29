import { ViewControl } from './viewControl.js';
import { Render } from './manageRenders.js';
import { createLights } from './createLights.js';
import { createBackWall } from './createBackWall.js';

class ThreeCanvas {

  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new Render();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 10, 60 );
    this.camera.position.set( 0, 0, 10 );
    this.controls = new ViewControl( this.camera, this.renderer.three.domElement );
    this.addEventListeners();
    this.finalizeBuild();
  }

    addEventListeners(){
      document.addEventListener('resize',
        () => {this.onWindowResize()}, false);
    }

    finalizeBuild(){
      createLights(this.scene);
      createBackWall(this.scene);
      
      this.animate();
    }

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.resize();
    }

    
    animate() {
      requestAnimationFrame((t) => {
        this.animate();
        this.renderer.render(this.scene, this.camera);
        this.controls.update(t,0);
      });
    }
}
export {ThreeCanvas};