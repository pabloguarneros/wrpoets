import { GLTFLoader } from 'three/examples/js/loaders/GLTFLoader.js';

class ModelLoad {
    constructor (path){
        this.path = path;
        this.model = "";
        this.add_to_scene = this.add_to_scene.bind(this);
        this.gui_loader = this.gui_loader.bind(this);
        this.set_mesh = this.set_mesh.bind(this);

    };

    add_to_scene(scene,xtra){
        const loader = new THREE.GLTFLoader();
        const this_object = this;
        loader.load( this.path, function (gltf) {
            this_object.model = gltf.scene;
            if(xtra.gui){
                this_object.gui_loader();
            }
            this_object.set_mesh(xtra.r,xtra.p,xtra.s);
            scene.add( this_object.model );
        }, undefined, function ( error ) {
            console.error( error );

        } );
    }


    set_mesh(r,p,s){
        this.model.rotation.y = r.y;
        this.model.position.set(p.x, p.y, p.z);
        this.model.scale.set(s.x, s.y, s.z);
    }

    gui_loader(){
        const gui = new dat.GUI()
        const modelFolder = gui.addFolder('New Model')
        modelFolder.add(this.model.rotation, 'x', 0, Math.PI * 2)
        modelFolder.add(this.model.rotation, 'y', 0, Math.PI * 2)
        modelFolder.add(this.model.rotation, 'z', 0, Math.PI * 2)
        modelFolder.add(this.model.position, 'x', -100, 100)
        modelFolder.add(this.model.position, 'y', -100, 100)
        modelFolder.add(this.model.position, 'z', -100, 100)
        modelFolder.add(this.model.scale, 'x', -100, 100)
        modelFolder.add(this.model.scale, 'y', -100, 100)
        modelFolder.add(this.model.scale, 'z', -100, 100)
        modelFolder.open()
    }

}

export {ModelLoad};