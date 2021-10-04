function render() {

    var cameraPosition = new THREE.Vector3();
    var cameraDirection = new THREE.Vector3();
    
    camera.getWorldPosition(cameraPosition);
    camera.getWorldDirection(cameraDirection);

    raycaster.set(cameraPosition,cameraDirection );
        
    intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length) {
        for (var i = 0; i < intersects.length; i++){
            if(intersects[i].object.userData.markerID){
                poemFound(intersects[i].object)
            } // endif
        };
    } else{ poemNotFound() }
    
    function poemFound(object){
        //object.scale.x += 0.01;
        //object.scale.y += 0.02;
        $("#identify_hit").css("border-color","#FBD748");
    }
    function poemNotFound(){
        $("#identify_hit").css("border-color","#47297B");
    }

    if (dragging) {
        dragObject(dragged_object);
    }

    renderer.render(scene, camera);

}