import { ModelLoad } from "../../minervaremote/js/model_class.js";

function load_models(scene, world, models_to_explore, physics_objects){

    const exp_goal = new ModelLoad("static/models/viking_longship/scene.gltf", "Skald Module", "#skald_module");
    exp_goal.add_to_scene(scene, world, models_to_explore,physics_objects,//EXPERIENCES
        {'gui':false,
        'r':{'x':0,'y':2.1,'z':6.3}, //rotation
        'p':{'x':4.6,'y': 0.2, 'z': 26.6}, // position
        's':{'x':0.03,'y':0.03,'z':0.03}}
    ); 

    }

export {load_models}