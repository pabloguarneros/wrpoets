import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';


$(document).ready(function(){
    
    let scene, clock, camera, renderer, raycaster, markerData;
    fetchNodes();

    async function fetchNodes(){
        const api = `/nubes/explore/collections`;
        fetch(api)
            .then(response => response.json())
            .then((data)=>{ three_init(data); });
        };

    function three_init(nodeArray) {

        scene = new THREE.Scene();
        clock = new THREE.Clock();
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.fog = new THREE.FogExp2( 0x47297B, .6 );
        raycaster = new THREE.Raycaster();
    
        var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        light.position.set(0.5, 1, 0.25);
        scene.add(light);
    
        markerData = [];
    
        function loadOrbs(){
    
            const defaultGeometry = new THREE.SphereBufferGeometry(.14,40,40);
            const defaultMaterial = new THREE.MeshPhongMaterial({
            color      :  new THREE.Color(0xF5BD1F),
                });
        
            for (var int in nodeArray){
    
                const node = nodeArray[int];
                const x_position = (Math.random() * 2) - 1; // center bias
                const y_position = (Math.random() * 2) - .2; // top bias
                const z_position = (Math.random() * 2) - 1.8; // front bias
    
                markerData.push({
                    position : [x_position,y_position,z_position+.1],
                    pk : node['pk'],
                    title : node['title'],
                })
    
                const defaultMesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
                defaultMesh.userData.markerID=int;
                defaultMesh.position.set(x_position, y_position, z_position);
                scene.add(defaultMesh);
    
            }
    
        } // end loadOrbs
    
        loadOrbs();

        if (/Mobi|Android/i.test(navigator.userAgent)) {
            phoneScene();
        }else{
            desktopScene();
        }
    
    } // end three_init

    function phoneScene(){
        
        let controller, arrow, font;
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.xr.enabled = true;
        $("#center_scene").append( renderer.domElement );

        const fontLoader = new THREE.FontLoader()
        var fontLoaded = false;
        fontLoader.load(
            '/static/js/fonts/helvetiker_regular.typeface.json',
            function(helvetiker){
                font = helvetiker;
                fontLoaded = true;
            })
        

        $("#ar_button")[0].appendChild(ARButton.createButton(renderer));

        arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, 0x47297B , 0,0);
        scene.add( arrow );

        function readPoem() {

            var intersects = raycaster.intersectObjects(scene.children);

            if(intersects.length){
                for (var i = 0; i < intersects.length; i++)
                    if(intersects[i].object.userData.markerID){
                        var markerID = intersects[i].object.userData.markerID;
                        const titleGeometry = new THREE.TextGeometry(
                            "Visit: ".concat(markerData[markerID].title),
                            {
                                font: font,
                                size: 0.03,
                                height: 0.02,
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
                        const titleMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0xF5BD1F)});
                        const title = new THREE.Mesh(titleGeometry, titleMaterial)
                        title.userData= { getPoem: `${markerData[markerID].pk}`};         
                        title.position.set( 0, .1, - 0.3 ).applyMatrix4( controller.matrixWorld );
                        title.quaternion.setFromRotationMatrix( controller.matrixWorld );
                        scene.add(title);
                    }  else if (intersects[i].object.userData.getPoem) {
                        window.location.href=(`${window.location.origin.concat(`/experiments/t/${intersects[i].object.userData.getPoem}`)}`);
                    }
            } // end if intersects

        } // end readPoem

        controller = renderer.xr.getController(0);
        controller.addEventListener('select', readPoem);
        scene.add(controller);

        window.addEventListener( 'resize', onWindowResize, false );
        
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }
        
        animate();

        function animate(){
            renderer.setAnimationLoop(renderPhone);
        }

        function renderPhone() {
            var cameraPosition = new THREE.Vector3();
            var cameraDirection = new THREE.Vector3();
            
            camera.getWorldPosition(cameraPosition);
            camera.getWorldDirection(cameraDirection);

            raycaster.set(cameraPosition,cameraDirection );
            arrow.setDirection(raycaster.ray.direction);
                
                
            var intersects = raycaster.intersectObjects(scene.children);
            
            if(intersects.length){
                for (var i = 0; i < intersects.length; i++){
                    if(intersects[i].object.userData.markerID|intersects[i].object.userData.getPoem){
                        arrow.setColor(0xF3CA26)
                        scene.fog = new THREE.FogExp2( 0xF3CA26, 5 );
                    }}
            } else{
                arrow.setColor(0x47297B)
                scene.fog = new THREE.FogExp2( 0x47297B, 5 );
                }
            renderer.render(scene, camera);
        }

    }  // end phoneScene

    function desktopScene(){
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 40);

        var mouse = new THREE.Vector2();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 

        // CONTROLS
        const controls = new FirstPersonControls( camera, $("#home_wrapper")[0] );
        controls.movementSpeed = 1;
        controls.lookSpeed = .03;

        $("#center_scene").append( renderer.domElement );
        renderer.setAnimationLoop(renderDesktop);
        desktopListeners();

        function renderDesktop(timestamp,frame){
            const delta = clock.getDelta();
            controls.update( delta );
            renderer.render(scene, camera);
        } // end renderDesktop
        
        // WINDOW EVENTS
        function desktopListeners(){
        
            window.addEventListener( 'resize', onWindowResize, false );
        
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
                controls.handleResize();
            }
            
            window.addEventListener('mousemove', onMouseMove, false);
            
            function onMouseMove( event ){
                mouse.x = (event.clientX / window.innerWidth ) * 2 -1;
                mouse.y = -(event.clientY / window.innerHeight ) * 2 +1;
                }
        
            $("#home_wrapper").on('click', function(e){
                raycaster.setFromCamera(mouse,camera);
                var intersects = raycaster.intersectObjects(scene.children);
                var markerID = null;
                if(intersects.length){
                    $("#browse_heading small").html("");
                    for (var i = 0; i < intersects.length; i++)
                        if(intersects[i].object.userData.markerID){
                            markerID = intersects[i].object.userData.markerID;
                            $("#browse_heading a").html(`link: ${markerData[markerID].title}`);
                            $("#browse_heading a").attr("href",`${window.location.origin.concat(`/experiments/t/${markerData[markerID].pk}`)}`);
                            $("#browse_heading .open_link").removeClass("off");
                            return;
                        }
                } else {
                    
                    if(e.target.tagName != "A"){
                        $("#browse_heading a").html("");
                        $("#browse_heading small").html("catch the poems");
                        $("#browse_heading .open_link").addClass("off");
                        };
                    }
        
            });
        } // END Desktop Listeners
    } // end desktopScene

})// end onDocumentLoad
