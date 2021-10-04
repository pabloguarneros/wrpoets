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