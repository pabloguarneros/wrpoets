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

    /*
    const pk = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    const url = window.location.origin.concat(`/nubes/nodes/${pk}`);

    fetch(url, { method:'POST', headers: defaultHeaders,
        body:JSON.stringify({
            "title": "New Item",
            "x_position": parseFloat(obj_data["pos_x"]).toFixed(3),
            "y_position": parseFloat(obj_data["pos_y"]).toFixed(3),
            "z_position": parseFloat(obj_data["pos_z"]).toFixed(3),
            "quat_x": parseFloat(obj_data["quat_x"]).toFixed(6),
            "quat_y": parseFloat(obj_data["quat_y"]).toFixed(6),
            "quat_z": parseFloat(obj_data["quat_z"]).toFixed(6),
            "quat_w": parseFloat(obj_data["quat_w"]).toFixed(6),
            "scale": 0.5,
        })})
            .then( () => { this.fetchPoems()
                .then( () => { component.forceUpdate() } )
            })
        } // end createPoem
        const poemID = collection.getPoem().pk;
        const formData = new FormData(); 
        const image_count = obj.state.images_to_upload.length;
        $("#upload_map button").html("uploading...");
            formData.append( 
                `1`, 
                obj.state.images_to_upload[i], 
                image 
              ); 
        };
        const url = window.location.origin.concat(`/nubes/nodes/${collection.pk}/${poemID}`);
        fetch(url, {
            method:'POST',
            mode: 'same-origin',  
            headers:{
                'Accept': 'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest', 
            },
            body:formData
        }).then(function(){
            collection.fetchPoems().then(()=>{obj.forceUpdate()});
        })
    }
    /*
        console.log(renderer)
    console.log(renderer.xr)
    console.log(renderer.xr.getCamera())
    var snapShotCanvas = document.createElement('canvas');
    snapShotCanvas.height = this.videoElement.height;
    snapShotCanvas.width = this.videoElement.width;
    let canvas = document.querySelector("canvas");
    let ctx = snapShotCanvas.getContext('2d');
    ctx.drawImage(video, 0, 0, snapShotCanvas.width,
        snapShotCanvas.height);
    let img = new Image();
    img.src = snapShotCanvas.toDataURL('image/png').replace('image/png',
        'image/octet-stream');
    console.log(img);*/
    //console.log(renderer.domElement.toDataURL());
    //console.log(canvas.getContext("webgl2", {preserveDrawingBuffer: true}));

};