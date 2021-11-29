function createBackWall(scene, gui=false){

    const groundGeometry = new THREE.PlaneGeometry( 20000, 2000);
    const groundMaterial = new THREE.MeshPhongMaterial( { color:0xdedede } );
    const ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.position.set(0,0,-40);
    ground.receiveShadow = true;
    scene.add( ground );

    if (gui){
        const gui = new dat.GUI()
        const modelFolder = gui.addFolder("Directional Light")
        modelFolder.add(light.position, 'x', -100, 100)
            .name("Position X");
        modelFolder.add(light.position, 'y', -100, 100)
            .name("Position Y");
        modelFolder.add(light.position, 'z', -100, 100)
            .name("Position Z");
        modelFolder.open()
    }

}

export {createBackWall}