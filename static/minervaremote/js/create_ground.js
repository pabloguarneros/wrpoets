
function create_ground(scene){

    const groundGeometry = new THREE.PlaneGeometry( 20000, 20000);
    groundGeometry.rotateX( - Math.PI / 2 );
    const groundMaterial = new THREE.MeshPhongMaterial( { color: 0x87DF9E } );
    const ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.receiveShadow = true;
    scene.add( ground );

}

export {create_ground}