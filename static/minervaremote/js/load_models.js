import { ModelLoad } from '../../atlahua/js/three/model_class.js';

function load_models(three){

    const greenhouse = new ModelLoad("static/models/greenhouse/scene.gltf", "Greenhouse Model", "#garden_div");
    greenhouse.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,
        {'gui':false,
        'r':{'x':0,'y':4,'z':0},
        'p':{'x':5,'y':0.2,'z':31},
        's':{'x':6,'y':6,'z':6}}
    );

    const ferris_wheel = new ModelLoad("static/models/ferris_wheel/scene.gltf", "Ferris Wheel");
    ferris_wheel.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,
        {'gui':false,
        'r':{'x':0,'y':0,'z':0}, //rotation
        'p':{'x':24,'y':11,'z':5}, // position
        's':{'x':10,'y':10,'z':10}}
    ); 

    const paint_brush = new ModelLoad("static/models/paint_brush/scene.gltf", "Paint Brush", "#art_div");
    paint_brush.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,
        {'gui':false,
        'r':{'x':0,'y':2.6,'z':2.2}, //rotation
        'p':{'x':-21.9,'y':0.2,'z':-2}, // position
        's':{'x':3,'y':3,'z':3}}
    ); 

    const black_dog = new ModelLoad("static/models/black_dog/scene.gltf", "Black Dog", "#pet_div");
    black_dog.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,
        {'gui':false,
        'r':{'x':0,'y':3,'z':0}, //rotation
        'p':{'x':-17,'y':0,'z':16}, // position
        's':{'x':0.05,'y':0.05,'z':0.05}}
    ); 

    const simple_obj = new ModelLoad("static/models/heart/scene.gltf", "Heart", "#day_in_the_life");
    simple_obj.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,//EXPERIENCES
        {'gui':false,
        'r':{'x':0, 'y': 2.3, 'z': 6.3}, //rotation
        'p':{'x': -35.1 ,'y': -4.3, 'z': 24.4}, // position
        's':{'x': 0.186, 'y': 0.186, 'z': 0.186}}
    );

    const tree = new ModelLoad("static/models/cone_tree/scene.gltf", "Tree");
    for (var i = 0; i < 70; i++){
        tree.add_to_scene(three.scene, three.world, three.models_to_explore, three.physics_objects,
            {'gui':false,
            'r':{'x':0,'y':0,'z':0}, //rotation
            'p':{'x':Math.random()*100-50,'y':5-Math.random()*1/2,'z':Math.random()*100-50}, // position
            's':{'x':0.3,'y':0.3,'z':0.3}}
        ); 
    }

    }

export {load_models}