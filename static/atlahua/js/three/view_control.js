import { FirstPersonControls } from 'three/examples/js/controls/FirstPersonControls.js';

class ViewControl{

    constructor (camera, domElement){

        this.camera = camera;
        this.controls = new THREE.FirstPersonControls( camera, domElement);
        this.look_vector = new THREE.Vector3( 0, 0, 0 );
        this.set_settings = this.set_settings.bind(this);
        this.update = this.update.bind(this);

    }

    set_settings(){
        this.controls.activeLook = false;
        this.controls.autoForward = false;
        this.controls.lookVertical = false;
        this.controls.constrainVertical = true;

    }

    create_gui(){
        const gui = new dat.GUI()
        const controls_folder = gui.addFolder('Controls')
        controls_folder.add(this.look_vector, 'x', -100, 100)
        controls_folder.add(this.look_vector, 'y', -100, 100)
        controls_folder.add(this.look_vector, 'z', -100, 100)
        controls_folder.open()
    }

    update(t, vector){
        this.camera.position.x = vector.x+8;
        this.camera.position.z = vector.z-16;
        this.camera.position.y = 12
        this.controls.lookAt(
            vector.x,
            vector.y+2,
            vector.z,
            );
        this.controls.update(t);
    }
}

export {ViewControl};