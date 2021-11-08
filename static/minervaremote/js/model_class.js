import { GLTFLoader } from 'three/examples/js/loaders/GLTFLoader.js';

class ModelLoad {
    constructor (path, name, divID = null, physicsID = null){
        this.path = path;
        this.name = name;
        this.divID = divID;
        this.physicsID = physicsID;
        this.model = "";
        this.add_to_scene = this.add_to_scene.bind(this);
        this.gui_loader = this.gui_loader.bind(this);
        this.set_mesh = this.set_mesh.bind(this);
        this.get_div_reference = this.get_div_reference.bind(this);

    };

    add_to_scene(scene, world, models_to_explore, physics_objects, xtra){
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
                models_to_explore.push(this_object.get_div_reference());
            };
            if (this_object.physicsID != null){
                physics_objects.push(this_object.get_physics_reference(world));
            };
        }, undefined, function ( error ) {
            console.error( error );

        } );
    }

    set_mesh(r,p,s){
        this.model.rotation.x = r.x;
        this.model.rotation.y = r.y;
        this.model.rotation.z = r.z;
        this.model.position.set(p.x, p.y, p.z);
        this.model.scale.set(s.x, s.y, s.z);
    }

    get_div_reference(){
        const pos = this.model.position;
        return(
            {"x_range":[pos.x - 8.5, pos.x + 8.5],
            "z_range":[pos.z - 8.5, pos.z + 8.5],
            "div_ID":this.divID}
        )
    }

    get_physics_reference(world){
        const physicsID = this.physicsID;
        var result = world.bodies.filter(obj => {
            return obj.id === physicsID
          })
        return({
            "model":this.model,
            "physics":result[0]}
        )
    }


    gui_loader(){
        const gui = new dat.GUI()
        const modelFolder = gui.addFolder(this.name)
        modelFolder.add(this.model.rotation, 'x', 0, Math.PI * 2)
        .listen().name("Rotate X").step( 0.1);
        modelFolder.add(this.model.rotation, 'y', 0, Math.PI * 2)
        .listen().name("Rotate Y").step( 0.1);
        modelFolder.add(this.model.rotation, 'z', 0, Math.PI * 2)
        .listen().name("Rotate Z").step( 0.1);
        modelFolder.add(this.model.position, 'x', -100, 100)
        .listen().name("Position X").step( 0.1);
        modelFolder.add(this.model.position, 'y', -100, 100)
        .listen().name("Position Y").step( 0.1);
        modelFolder.add(this.model.position, 'z', -100, 100)
        .listen().name("Position Z").step( 0.1);
        modelFolder.add(this.model.scale, 'x', 0, 7)
        .listen().name("Scale X").step( 0.01);
        modelFolder.add(this.model.scale, 'y', 0, 7)
        .listen().name("Scale Y").step( 0.01 );
        modelFolder.add(this.model.scale, 'z', 0, 7)
        .listen().name("Scale Z").step( 0.01 );
        modelFolder.open()
    }

}

export {ModelLoad};