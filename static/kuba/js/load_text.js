import { SceneText } from "../../atlahua/js/three/text_class.js";;

function load_font(three){
    const fontLoader = new THREE.FontLoader()
        fontLoader.load(
            '/static/js/fonts/helvetiker_regular.typeface.json',
            function(helvetiker){
                loadTexts(helvetiker, three.scene, three.models_to_explore);
    })
}

function loadTexts(font, scene, models_to_explore){
    
    const text_1 = new SceneText("Experience",font, "#experience")
    text_1.addText(font, scene, models_to_explore,
        {'gui':false,
        'r':{'x':0,'y':3.1,'z':6.3},
        'p':{'x':4.6,'y':4.6,'z':17.8}
        });
    const text_2 = new SceneText("Education", font, "#education")
    text_2.addText(font, scene, models_to_explore,
        {'gui':false,
        'r':{'x':0,'y':2.8,'z':6.3},
        'p':{'x':-4,'y':4.6,'z':33}
        });
    const text_3 = new SceneText("My Projects", font, "#my_projects")
    text_3.addText(font, scene, models_to_explore,
        {'gui':false,
        'r':{'x':0,'y':2.6,'z':6.3},
        'p':{'x':-24,'y':2.4,'z':35}
        });
    const text_4 = new SceneText("Accomplishments", font, "#accomplishments")
    text_4.addText(font, scene, models_to_explore,
        {'gui':false,
        'r':{'x':0,'y':2.7,'z':6.3},
        'p':{'x':-17,'y':2.4,'z':53}
        });
    const text_5 = new SceneText("Skills + Interests", font, "#interests")
    text_5.addText(font, scene, models_to_explore,
        {'gui':false,
        'r':{'x':0,'y':2.5,'z':6.3},
        'p':{'x':-22,'y':4.6,'z':16}
        });

}

export {load_font};