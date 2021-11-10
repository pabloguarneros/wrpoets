import { ModelLoad } from './model_class.js';

function load_models(scene, world, models_to_explore, physics_objects){

    const greenhouse = new ModelLoad("static/models/greenhouse/scene.gltf", "Greenhouse Model", "#garden_div");
    greenhouse.add_to_scene(scene, world, models_to_explore,physics_objects,
        {'gui':false,
        'r':{'x':0,'y':4,'z':0},
        'p':{'x':5,'y':0.2,'z':31},
        's':{'x':6,'y':6,'z':6}}
    );

    /* const map = new ModelLoad("static/models/map/scene.gltf", "Map Model");
    map.add_to_scene(scene, world, models_to_explore,physics_objects,
        {'gui':false,
        'r':{'x':0,'y':3,'z':0}, //rotation
        'p':{'x':-22,'y':0,'z':-2}, // position
        's':{'x':3,'y':3,'z':3}}
    ); */

    const ferris_wheel = new ModelLoad("static/models/ferris_wheel/scene.gltf", "Ferris Wheel");
    ferris_wheel.add_to_scene(scene, world, models_to_explore,physics_objects,
        {'gui':false,
        'r':{'x':0,'y':0,'z':0}, //rotation
        'p':{'x':24,'y':11,'z':5}, // position
        's':{'x':10,'y':10,'z':10}}
    ); 

    const paint_brush = new ModelLoad("static/models/paint_brush/scene.gltf", "Paint Brush", "#art_div");
    paint_brush.add_to_scene(scene, world, models_to_explore,physics_objects,
        {'gui':false,
        'r':{'x':0,'y':2.6,'z':2.2}, //rotation
        'p':{'x':-21.9,'y':0.2,'z':-2}, // position
        's':{'x':3,'y':3,'z':3}}
    ); 

    const black_dog = new ModelLoad("static/models/black_dog/scene.gltf", "Black Dog", "#pet_div");
    black_dog.add_to_scene(scene, world, models_to_explore,physics_objects,
        {'gui':false,
        'r':{'x':0,'y':3,'z':0}, //rotation
        'p':{'x':-17,'y':0,'z':16}, // position
        's':{'x':0.05,'y':0.05,'z':0.05}}
    ); 

    /*const bread = new ModelLoad("static/models/bread/scene.gltf", "Bread", "#bread_div");
    bread.add_to_scene(scene, world, models_to_explore,physics_objects,
        {'gui':false,
        'r':{'x':0,'y':0,'z':0}, //rotation
        'p':{'x':22,'y':0,'z':-17}, // position
        's':{'x':3,'y':3,'z':3}}
    );*/

    const tree = new ModelLoad("static/models/cone_tree/scene.gltf", "Tree");
    for (var i = 0; i < 70; i++){
        tree.add_to_scene(scene, world, models_to_explore,physics_objects,
            {'gui':false,
            'r':{'x':0,'y':0,'z':0}, //rotation
            'p':{'x':Math.random()*100-50,'y':5-Math.random()*1/2,'z':Math.random()*100-50}, // position
            's':{'x':0.3,'y':0.3,'z':0.3}}
        ); 
    }


    }

export {load_models}