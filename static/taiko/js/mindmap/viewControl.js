import { TrackballControls } from 'three/examples/js/controls/TrackballControls.js';
import { DragControls } from 'three/examples/js/controls/DragControls.js';

class ViewControl{

    constructor (camera, domElement, type="trackball", objects=null){
        this.camera = camera;
        switch (type){
            case "trackball":
                this.controls = new THREE.TrackballControls( camera, domElement);
                this.set_trackball_settings();
                break
            case "drag":
                this.controls = new THREE.DragControls( objects, camera, domElement);
                this.set_drag_settings();
                break   
        }
        this.update = this.update.bind(this);
    }

    set_drag_settings(){
        this.controls.staticMoving = false;
        this.controls.noRotate  = false;
    }

    set_trackball_settings(){
        this.controls.staticMoving = false;
        this.controls.noRotate  = true;
    }

    create_gui(){
        const gui = new dat.GUI()
        const controls_folder = gui.addFolder('Controls')
        controls_folder.add(this.look_vector, 'x', -100, 100)
        controls_folder.add(this.look_vector, 'y', -100, 100)
        controls_folder.add(this.look_vector, 'z', -100, 100)
        controls_folder.open()
    }

    update(t,z){
        this.camera.position.z += z;
        this.controls.update(t, 0);
    }
}

export {ViewControl};