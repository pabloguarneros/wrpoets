function takePicture (){
    console.log("take_img");
    const current_img = video.toDataURL('image/jpg');
    const loadingManager = new THREE.LoadingManager( () => {
        window.setTimeout(() => { console.log("loaded") } )
    })   

    const ar_display = new THREE.PlaneBufferGeometry(.45,.45);
    const writing_texture = new THREE.TextureLoader(loadingManager).load(current_img);
    const writing_pattern = new THREE.MeshBasicMaterial( {
        map: writing_texture,
        transparent: true 
    } );
    const writingMesh = new THREE.Mesh(ar_display,writing_pattern);
    
    writingMesh.position.set(0,0,-.5).applyMatrix4( controller.matrixWorld );
    writingMesh.quaternion.setFromRotationMatrix( controller.matrixWorld );

    scene.add(writingMesh);

};