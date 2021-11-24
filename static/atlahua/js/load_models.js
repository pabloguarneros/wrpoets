import { ModelLoad } from "./three/model_class.js";

function load_models(three){

    const film_obj = new ModelLoad("static/models/cone_tree/scene.gltf", "Cone Tree", "#film");
    film_obj.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,//EXPERIENCES
        {'gui':false,
        'r':{'x':0, 'y': 4, 'z': 6.3}, //rotation
        'p':{'x': -15.3 ,'y': 9, 'z': 0.2}, // position
        's':{'x': 0.649, 'y': 0.649, 'z': 0.649}}
    ); 


    const life_obj = new ModelLoad("static/models/corkscrew/scene.gltf", "Corkscrew", "#science");
    life_obj.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,//EXPERIENCES
        {'gui':false,
        'r':{'x':0,'y':6.3, 'z':3.6}, //rotation
        'p':{'x':2.4, 'y': 0.2, 'z': 35.4}, // position
        's':{'x': 1.12,'y': 1.12,'z': 1.12}}
    );

    const childhood_obj = new ModelLoad("static/models/giraffe/scene.gltf", "Giraffe", "#childhood");
    childhood_obj.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,//EXPERIENCES
        {'gui':false,
        'r':{'x':0,'y': 4.3, 'z':0}, //rotation
        'p':{'x': -13.1, 'y': 0.1, 'z': 24.4}, // position
        's':{'x': 0.031,'y': 0.031,'z': 0.031}}
    );

    const simple_obj = new ModelLoad("static/models/heart/scene.gltf", "Heart", "#simple");
    simple_obj.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,//EXPERIENCES
        {'gui':false,
        'r':{'x':0, 'y': 2.3, 'z': 6.3}, //rotation
        'p':{'x': -35.1 ,'y': -4.3, 'z': 24.4}, // position
        's':{'x': 0.186, 'y': 0.186, 'z': 0.186}}
    );

    const science_obj = new ModelLoad("static/models/paint_brush/scene.gltf", "Paint Brush", "#life");
    science_obj.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,//EXPERIENCES
        {'gui':false,
        'r':{'x':0,'y':3.4,'z': 2}, //rotation
        'p':{'x': 6.8 ,'y': 0.2, 'z': 20}, // position
        's':{'x': 1.421, 'y': 1.421, 'z':1.421}}
    );

    }

export {load_models}