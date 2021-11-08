import { ModelLoad } from "../../minervaremote/js/model_class.js";

function load_models(scene, world, models_to_explore, physics_objects){

    const exp_goal = new ModelLoad("static/models/soccer_field/scene.gltf", "Experience");
    exp_goal.add_to_scene(scene, world, models_to_explore,physics_objects,//EXPERIENCES
        {'gui':false,
        'r':{'x':0,'y':2.7,'z':0}, //rotation
        'p':{'x':-13.1,'y': 0.2, 'z': 28.8}, // position
        's':{'x':1.03,'y':0.57,'z':0.96}}
    ); 
    /*

    const ball = new ModelLoad("static/models/soccer_ball/scene.gltf", "Ball",null,"soccer_ball");
    ball.add_to_scene(scene, world, models_to_explore,physics_objects,
        {'gui':false,
        'r':{'x':0,'y':4,'z':0}, //rotation
        'p':{'x':-11,'y':2,'z':9}, // position
        's':{'x':0.9,'y':0.9,'z':0.9}}
    );*/

    }

export {load_models}