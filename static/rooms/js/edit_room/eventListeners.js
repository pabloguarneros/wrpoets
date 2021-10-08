function initializeEventListeners(nodeArray){
    
    $("#ARButton").on("click",()=>{
        $("svg").replaceWith("<div id='identify_hit'><button id='save_edit'>save</button></div>");
        $("#save_edit").on('click', saveEdit)
        load_image_capture();
    })

    function saveEdit(){
        for (var i in scene.children){
            if (scene.children[i].userData.markerID){
                const room_pk = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
                const node_pk = nodeArray[scene.children[i].userData.markerID]["pk"];
                const position = scene.children[i].position;
                const quaternion = scene.children[i].quaternion;
                const geometry = scene.children[i].geometry;
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
    
    controller.addEventListener("selectstart",function(){
        if (intersects.length) {
            for (var i = 0; i < intersects.length; i++){
                if(intersects[i].object.userData.markerID){
                    dragging = true;
                    dragged_object = intersects[i].object;
                    break
                } 
            }}});

    controller.addEventListener("selectend",function(){
            dragging = false;
            })
    
    window.addEventListener( 'resize', onWindowResize, false );
        
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

}
