import { FlyControls } from 'three/examples/js/controls/FlyControls.js';

class ViewControl{

    constructor (camera, domElement){

        this.camera = camera;
        this.controls = new THREE.FlyControls( camera, domElement);
        this.set_settings = this.set_settings.bind(this);
        this.update = this.update.bind(this);

    }

    set_settings(){
        this.controls.autoForward = false;
        this.controls.dragToLook  = true;
    }

    create_gui(){
        const gui = new dat.GUI()
        const controls_folder = gui.addFolder('Controls')
        controls_folder.add(this.look_vector, 'x', -100, 100)
        controls_folder.add(this.look_vector, 'y', -100, 100)
        controls_folder.add(this.look_vector, 'z', -100, 100)
        controls_folder.open()
    }

    update(t){
        this.controls.update(t);
    }
}

export {ViewControl};