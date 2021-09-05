import * as THREE from 'three';

function loadImages(augmented_environment){

    const loadingManager = new THREE.LoadingManager();

    const defaultMaterial = new THREE.MeshPhongMaterial( { color : new THREE.Color(0xF5BD1F) });

    for (var int in augmented_environment.imageData){

        const node = augmented_environment.imageData[int]

        const scale = node['scale']

        const x_origin = node['x_position']
        const y_origin = node['y_position']
        const z_origin = node['z_position']
        
        const quaternion_arr = [ +node['quat_x'], +node['quat_y'], +node['quat_z'], +node['quat_w'] ]

        const images = node['images']

        augmented_environment.markerData.push({
            position : [ x_origin , y_origin + .5 , z_origin + .1 ],
            headline : node['title'],
        })

        if (images.length>0){

            const ar_display = new THREE.PlaneBufferGeometry(scale,scale)

            for (var i in images){
                const writing_texture = new THREE.TextureLoader(loadingManager).load(images[i]["image"]);
                const writing_pattern = new THREE.MeshBasicMaterial( {
                    map: writing_texture,
                    transparent: true 
                } );
                const writingMesh = new THREE.Mesh(ar_display,writing_pattern);
                writingMesh.userData.markerID=int;
                
                writingMesh.position.set(x_origin, y_origin, z_origin);
                writingMesh.quaternion.fromArray(quaternion_arr);

                augmented_environment.scene.add(writingMesh);
            }

        } else {

            const defaultGeometry = new THREE.SphereBufferGeometry(scale-.2,40,40);

            const defaultMesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
            defaultMesh.userData.markerID=int;
            
            defaultMesh.position.set(x_origin,y_origin,z_origin);
            defaultMesh.quaternion.fromArray(quaternion_arr);
            
            augmented_environment.scene.add(defaultMesh);

        }
    }

}

export default loadImages;