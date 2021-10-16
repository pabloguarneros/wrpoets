import { GLTFLoader } from 'three/examples/js/loaders/GLTFLoader.js';

class ModelLoad {
    constructor (path, name, divID = null ){
        this.path = path;
        this.name = name;
        this.divID = divID;
        this.model = "";
        this.add_to_scene = this.add_to_scene.bind(this);
        this.gui_loader = this.gui_loader.bind(this);
        this.set_mesh = this.set_mesh.bind(this);
        this.get_reference = this.get_reference.bind(this);

    };

    add_to_scene(scene,models_to_explore,xtra){
        const loader = new THREE.GLTFLoader();
        const this_object = this;
        loader.load( this.path, function (gltf) {
            this_object.model = gltf.scene;
            if(xtra.gui){
                this_object.gui_loader();
            }
            this_object.set_mesh(xtra.r,xtra.p,xtra.s);
            scene.add( this_object.model );
            if (this_object.divID != null){
                models_to_explore.push(this_object.get_reference());
            }
        }, undefined, function ( error ) {
            console.error( error );

        } );
    }

    set_mesh(r,p,s){
        this.model.rotation.y = r.y;
        this.model.position.set(p.x, p.y, p.z);
        this.model.scale.set(s.x, s.y, s.z);
    }

    get_reference(){
        const pos = this.model.position;
        const scale = this.model.scale;
        return(
            {"x_range":[pos.x - scale.x*2, pos.x + scale.x*2],
            "z_range":[pos.z - scale.z*2, pos.z + scale.z*2],
            "div_ID":this.divID}
        )
    }


    gui_loader(){
        const gui = new dat.GUI()
        const modelFolder = gui.addFolder(this.name)
        modelFolder.add(this.model.rotation, 'x', 0, Math.PI * 2)
            .name("Rotate X");
        modelFolder.add(this.model.rotation, 'y', 0, Math.PI * 2)
            .name("Rotate Y");
        modelFolder.add(this.model.rotation, 'z', 0, Math.PI * 2)
            .name("Rotate Z");
        modelFolder.add(this.model.position, 'x', -100, 100)
            .name("Position X");
        modelFolder.add(this.model.position, 'y', -100, 100)
            .name("Position Y");
        modelFolder.add(this.model.position, 'z', -100, 100)
            .name("Position Z");
        modelFolder.add(this.model.scale, 'x', 0, 20)
            .name("Scale X");
        modelFolder.add(this.model.scale, 'y', 0, 20)
            .name("Scale Y");
        modelFolder.add(this.model.scale, 'z', 0, 20)
            .name("Scale Z");
        modelFolder.open()
    }

}

export {ModelLoad};