
import $ from "jquery";
import {defaultHeaders} from '../on_load/fetch_logic.js';

function handleSave(room_pk, node_pk, obj_data){
    const url = window.location.origin.concat(`/nubes/nodes/${room_pk}/${node_pk}`);

    fetch(url, { method:'PATCH', headers: defaultHeaders,
        body:JSON.stringify({
            "x_position": parseFloat(obj_data["pos_x"]).toFixed(3),
            "y_position": parseFloat(obj_data["pos_y"]).toFixed(3),
            "z_position": parseFloat(obj_data["pos_z"]).toFixed(3),
            "quat_x": parseFloat(obj_data["quat_x"]).toFixed(6),
            "quat_y": parseFloat(obj_data["quat_y"]).toFixed(6),
            "quat_z": parseFloat(obj_data["quat_z"]).toFixed(6),
            "quat_w": parseFloat(obj_data["quat_w"]).toFixed(6),
            "scale": 0.5,
        })
        
    }).then(function(){
        $('#save_edit').addClass("isSaved");
        $('#save_edit').on("animationend", () => { $('#save_edit').removeClass("isSaved") });
    })
};

function save_edit(augmented_environment){

    for (var i in augmented_environment.scene.children){
        if (augmented_environment.scene.children[i].userData.markerID){
            const room_pk = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            const node_pk = augmented_environment.imageData[augmented_environment.scene.children[i].userData.markerID]["pk"];
            const position = augmented_environment.scene.children[i].position;
            const quaternion = augmented_environment.scene.children[i].quaternion;
            const geometry = augmented_environment.scene.children[i].geometry;
            var obj_data = {"pos_x":position.x, "pos_y":position.y, "pos_z":position.z,
                            "quat_x": quaternion.x, "quat_y":quaternion.y,
                            "quat_z":quaternion.z, "quat_w":quaternion.w,
                            "scale":0.4}
            if (geometry.type == "SphereGeometry"){
                obj_data["scale"]=.4;
            } else if (geometry.type == "PlaneGeometry"){
                obj_data["scale"]=.4;
            }
            handleSave(room_pk, node_pk, obj_data)
        }
    }
}

export {save_edit};