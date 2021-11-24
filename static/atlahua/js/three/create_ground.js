function create_ground(scene, colors){

    const groundGeometry = new THREE.PlaneGeometry( 20000, 2000);
    groundGeometry.rotateX( - Math.PI / 2 );
    const groundMaterial = new THREE.MeshPhongMaterial( { color: colors.light } );
    const ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.receiveShadow = true;
    scene.add( ground );

}

export {create_ground}