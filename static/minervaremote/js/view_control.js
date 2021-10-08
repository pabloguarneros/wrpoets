        
import { FirstPersonControls } from 'three/examples/js/controls/FirstPersonControls.js';


class ViewControl{

    constructor (camera, domElement){

        this.controls = new THREE.FirstPersonControls( camera, domElement);
        this.look_vector = new THREE.Vector3( 0, 0, 0 );
        this.set_settings = this.set_settings.bind(this);
        this.update = this.update.bind(this);

    }

    set_settings(){
        this.controls.activeLook = false;
        this.controls.autoForward = false;
        this.controls.lookVertical = false;

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
        this.controls.lookAt(vector);
        this.controls.update(t);
    }
}

export {ViewControl};