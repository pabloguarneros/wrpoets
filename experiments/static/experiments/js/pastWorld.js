import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';


    let camera, scene, renderer;
    let controller,raycaster,arrow;
    let loader;
    let font;
    const worldWidth = 128, worldDepth = 128;
    const clock = new THREE.Clock();
    const fontLoader = new THREE.FontLoader()
    var fontLoaded = false;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 40);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.fog = new THREE.FogExp2( 0x47297B, .6 );

    fontLoader.load(
        '/static/js/fonts/helvetiker_regular.typeface.json',
        function(helvetiker){
            font = helvetiker;
            fontLoaded = true;
        })
    raycaster = new THREE.Raycaster();
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        $("#main_instructions").html("click when ---O--- ");
        renderer.xr.enabled = true; // we have to enable the renderer for webxr
        renderer.setPixelRatio(window.devicePixelRatio);
        controller = renderer.xr.getController(0);
        scene.add(controller);
        controller.addEventListener('select', readPoem);
        document.body.appendChild(ARButton.createButton(renderer));
        arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, 0x47297B , 0,0);
        scene.add( arrow );
    } else{
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        createTerrain();
    }

    var mouse = new THREE.Vector2();
    const loadingManager = new THREE.LoadingManager(
        // Loaded
        () =>
        {window.setTimeout(() =>
            {}, 500)
            window.setTimeout(() =>
            { curtains_off();}, 2000)
        },
        (itemUrl, itemsLoaded, itemsTotal) =>
        { const progressRatio = itemsLoaded / itemsTotal }
    )

    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    function createTerrain(){
        const geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
        geometry.rotateX( - Math.PI / 2 );
        const position = geometry.attributes.position;
        position.usage = THREE.DynamicDrawUsage;
        for ( let i = 0; i < position.count; i ++ ) {
            const y = 20 * Math.random();
            position.setY( i, y );
        }
        const material = new THREE.MeshBasicMaterial( { color: 0x722E9A } );
        const mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh ); 

    }

    let markerData = [];
    
    const ar_display = new THREE.PlaneBufferGeometry(.3,.3);
    const defaultGeometry = new THREE.SphereBufferGeometry(.14,40,40);
    const defaultMaterial = new THREE.MeshPhongMaterial({
        color      :  new THREE.Color(0xF5BD1F),
      });
    const defaultMaterialSelected = new THREE.MeshPhongMaterial({
        color      :  new THREE.Color(0x722E9A),
    });

    
    for (var int in nodeArray){

        const node = nodeArray[int]
        const x_origin = node['x_position']
        const y_origin = node['y_position']
        const z_origin = node['z_position']
        const squishy = node['squishy']
        const pk = node['pk']
        const images = node['images']

        markerData.push({
            position : [node['x_position'],node['y_position']+.5,node['z_position']+.1],
            headline : node['title'],
            description : node['description'],
        })

        if (images.length>0){
            for (var i in images){
                const writing_texture = new THREE.TextureLoader(loadingManager).load(images[i]["image"]);
                const writing_pattern = new THREE.MeshBasicMaterial( { map: writing_texture } );
                writing_pattern.transparent = true;
                const writingMesh = new THREE.Mesh(ar_display,writing_pattern);
                const z = z_origin - i * squishy
                writingMesh.userData.markerID=int;
                writingMesh.position.set(x_origin,y_origin,z);
                scene.add(writingMesh);
            }
        } else{
            const defaultMesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
            defaultMesh.userData.markerID=int;
            defaultMesh.position.set(x_origin,y_origin,z_origin);
            scene.add(defaultMesh);
            curtains_off();
        }
    }


   function onMouseMove( event ){
       mouse.x = (event.clientX / window.innerWidth ) * 2 -1;
       mouse.y = -(event.clientY / window.innerHeight ) * 2 +1;

   }

   window.addEventListener('mousemove', onMouseMove, false);
   
   $("#three_canvas").on('click', onWindowClick);
   window.addEventListener('keydown', onKeyClick);
   function onKeyClick(){
    $("#course_content").addClass("close").removeClass("open");
   }
   function onWindowClick(){
        raycaster.setFromCamera(mouse,camera);
        var intersects = raycaster.intersectObjects(scene.children);
        var markerID = null;
        function checkHit(){
            if(intersects.length){
                $("#interaction_alerts #alert").html("");
                for (var i = 0; i < intersects.length; i++)
                    if(intersects[i].object.userData.markerID){
                        markerID = intersects[i].object.userData.markerID;
                        $("#course_content").addClass("open").removeClass("close");
                        $("#course_content .head").html(markerData[markerID].headline)
                        $("#course_content .body").html(markerData[markerID].description);
                        return;
                    }
                    $("#course_content").addClass("close").removeClass("open");
            }else{
                $("#interaction_alerts #alert").html("get closer");
                $("#course_content").addClass("close").removeClass("open");
            }
        }
        checkHit();
    }

     // CONTROLS
    const controls = new FirstPersonControls( camera, $("#three_canvas")[0] );
    controls.movementSpeed = 1;
    controls.lookSpeed = .03;

    $("#three_canvas").append( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    animate();

    function readPoem() {

        var intersects = raycaster.intersectObjects(scene.children);
        var markerID = null;
        if(intersects.length){
            for (var i = 0; i < intersects.length; i++)
                if(intersects[i].object.userData.markerID){
                    markerID = intersects[i].object.userData.markerID;
                    const titleGeometry = new THREE.TextGeometry(
                        markerData[markerID].headline,
                        {
                            font: font,
                            size: 0.02,
                            height: 0.01,
                            curveSegments: 6,
                            bevelEnabled: false,
                        }
                    )
                    titleGeometry.computeBoundingBox();
                    titleGeometry.translate(
                        - titleGeometry.boundingBox.max.x * 0.5,
                        - titleGeometry.boundingBox.max.y * 0.5,
                        - titleGeometry.boundingBox.max.z * 0.5
                    );
                    const titleMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
                    const title = new THREE.Mesh(titleGeometry, titleMaterial)
                    title.position.set( 0, .1, - 0.3 ).applyMatrix4( controller.matrixWorld );
                    title.quaternion.setFromRotationMatrix( controller.matrixWorld );
                    scene.add(title);

                    const poemGeometry = new THREE.TextGeometry(
                        markerData[markerID].description,
                        {
                            font: font,
                            size: 0.005,
                            height: 0.005,
                            curveSegments: 6,
                            bevelEnabled: false,
                        }
                    )
                    poemGeometry.computeBoundingBox();
                    poemGeometry.translate(
                        - poemGeometry.boundingBox.max.x * 0.5,
                        - poemGeometry.boundingBox.max.y * 0.5,
                        - poemGeometry.boundingBox.max.z * 0.5
                    );
                    const poemMaterial = new THREE.MeshBasicMaterial()
                    const poem = new THREE.Mesh(poemGeometry, poemMaterial)
                    poem.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
                    poem.quaternion.setFromRotationMatrix( controller.matrixWorld );
                    scene.add(poem);
                    fogValue = 0;
                    return;
                }
        }else{
            console.log("no hit");
        }
      }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
    }
    
    function animate() {
        renderer.setAnimationLoop(render);

    }

    let viewerPose = null;
    var fogValue = .6;
    function render(timestamp,frame) {
            if (/Mobi|Android/i.test(navigator.userAgent)) {
            if (frame) {
                // 1. create a hit test source once and keep it for all the frames
                // this gets called only once
                if (!hitTestSourceInitialized) {
                initializeHitTestSource();
                } else{
                hitTestResults = frame.getHitTestResults(hitTestSource);
                viewerPose = frame.getViewerPose(xrReferenceSpace);
                var cameraPosition = new THREE.Vector3();
                var cameraDirection = new THREE.Vector3();
                var viewerPosition = new THREE.Vector3(viewerPose.transform.position.x,
                                                    viewerPose.transform.position.y,
                                                    viewerPose.transform.position.z)
                camera.getWorldPosition(cameraPosition);
                camera.getWorldDirection(cameraDirection);
                //raycaster.set(viewerPosition.applyMatrix4( controller.matrixWorld ),cameraDirection );
                raycaster.set(cameraPosition,cameraDirection );
            
                arrow.setDirection(raycaster.ray.direction);

                var intersects = raycaster.intersectObjects(scene.children);
                if(intersects.length){
                    for (var i = 0; i < intersects.length; i++){
                        if(intersects[i].object.userData.markerID){
                            arrow.cone.scale.set( 2, 2, 2 );
                            arrow.setColor(0xF3CA26)
                            fogValue = fogValue-.05;
                            var fogFinalValue = Math.max(0,fogValue);
                            scene.fog = new THREE.FogExp2( 0x47297B, fogFinalValue);
                        }}
                } else{
                    arrow.setColor(0x47297B)
                    fogValue = fogValue+.05;
                    var fogFinalValue = Math.min(.6,fogValue);
                    scene.fog = new THREE.FogExp2( 0x47297B, fogFinalValue);
                    }
                    fogValue = fogFinalValue;
                }
    
                }}
        const delta = clock.getDelta();
        controls.update( delta );
        renderer.render(scene, camera);
    }

    function curtains_off() {
        $('#home_loader').css("animation","curtain_off 1s ease 1s 1 forwards")
        $('#home_loader').on("animationend",function(e){
            $('#home_loader').css("display","none");
        })
    }

}

});