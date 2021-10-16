function create_lights(scene, gui=false){

    scene.fog = new THREE.Fog( 0x9EE482, 10, 50 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );


    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(100, 20, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 50;
    light.shadow.camera.right = -50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    scene.add(light);

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

export {create_lights}