import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';

$(document).ready(function(){
    
    let scene, clock, camera, renderer, raycaster, markerData;
    fetchNodes();

    async function fetchNodes(){
        const api = `/nubes/nodes/${window.location.href.substring(window.location.href.lastIndexOf('/') + 1)}`;
        fetch(api)
            .then( response => response.json() )
            .then( (data) => { three_init(data) });
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

        loadOrbs();
    
        function loadOrbs(){

            const loadingManager = new THREE.LoadingManager( () => {
                window.setTimeout(() => { reveal() }, 50)
            })        

            function reveal() {
                $('#home_loader').css("animation","curtain_off 1s ease 1s 1 forwards");
                $('#home_loader').on("animationend", () => { $('#home_loader').css("display","none") });
            }

            const ar_display = new THREE.PlaneBufferGeometry(.3,.3);
            const defaultGeometry = new THREE.SphereBufferGeometry(.14,40,40);
            const defaultMaterial = new THREE.MeshPhongMaterial( { color : new THREE.Color(0xF5BD1F) });

            markerData = [];
        
            for (var int in nodeArray){
    
                const node = nodeArray[int]
                const x_origin = node['x_position']
                const y_origin = node['y_position']
                const z_origin = node['z_position']
                const images = node['images']
        
                markerData.push({
                    position : [ x_origin , y_origin + .5 , z_origin + .1 ],
                    headline : node['title'],
                    description : node['description'],
                })
        
                if (images.length>0){

                    for (var i in images){
                        const writing_texture = new THREE.TextureLoader(loadingManager).load(images[i]["image"]);
                        const writing_pattern = new THREE.MeshBasicMaterial( {
                            map: writing_texture,
                            transparent: true 
                        } );
                        const writingMesh = new THREE.Mesh(ar_display,writing_pattern);
                        writingMesh.userData.markerID=int;
                        
                        const z = z_origin - i * node['squishy']
                        writingMesh.position.set(x_origin,y_origin,z);

                        scene.add(writingMesh);
                    }

                } else {
                    const defaultMesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
                    defaultMesh.userData.markerID=int;
                    
                    defaultMesh.position.set(x_origin,y_origin,z_origin);
                    
                    scene.add(defaultMesh);
                } // endif
            } // endfor  
    
        } // end loadOrbs

        if (/Mobi|Android/i.test(navigator.userAgent)) {
            phoneScene();
        }else{
            desktopScene();
        }
    
    } // end three_init

    function phoneScene(){

        let controller, arrow, font, intersects;

        const fontLoader = new THREE.FontLoader()
        fontLoader.load(
            '/static/js/fonts/helvetiker_regular.typeface.json',
            function(helvetiker){
                font = helvetiker;
            })
        
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.xr.enabled = true;
        $("#three_canvas").append( renderer.domElement );

        $("#main_instructions").html("");
        document.body.appendChild(ARButton.createButton(renderer));

        arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, 0x47297B , 0,0);
        scene.add( arrow );

        controller = renderer.xr.getController(0);
        scene.add(controller);
        controller.addEventListener('select', readPoem);

        function readPoem() {

            if(intersects.length){
                for (var i = 0; i < intersects.length; i++)
                    if(intersects[i].object.userData.markerID){
                        var markerID = intersects[i].object.userData.markerID;
                        
                        // Title Render
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
    
                        // Poem Render
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
                        
                        return;
                    }

            } // endif
        } // end readPoem()

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
            arrow.setDirection(cameraDirection);
                
            intersects = raycaster.intersectObjects(scene.children);
            
            if (intersects.length) {
                for (var i = 0; i < intersects.length; i++){
                    if(intersects[i].object.userData.markerID|intersects[i].object.userData.getPoem){
                        poemFound()
                    } // endif
                };
            } else{ poemNotFound() }
            
            function poemFound(){
                arrow.setColor(0xF3CA26)
                scene.fog = new THREE.FogExp2( 0xF3CA26, .4 );
            }

            function poemNotFound(){
                arrow.setColor(0x47297B)
                scene.fog = new THREE.FogExp2( 0x47297B, .4 );
            }

            renderer.render(scene, camera);

        } // end renderPhone()

    }  // end phoneScene()

    function desktopScene(){

        var mouse = new THREE.Vector2();
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 40);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 

        const controls = new FirstPersonControls( camera, $("#home_wrapper")[0] );
        controls.movementSpeed = 1;
        controls.lookSpeed = .03;

        $("#three_canvas").append( renderer.domElement );
        
        desktopListeners();
        
        function desktopListeners(){
        
            window.addEventListener(
                'resize',
                () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize( window.innerWidth, window.innerHeight );
                    controls.handleResize();
                },
                false
            );
    
            window.addEventListener(
                'mousemove',
                (event) => {
                    mouse.x = (event.clientX / window.innerWidth ) * 2 -1;
                    mouse.y = -(event.clientY / window.innerHeight ) * 2 +1
                },
                false
            );
            
            window.addEventListener(
                'keydown',
                () => {
                    $("#course_content").addClass("close").removeClass("open")
                },
                false
            );
        
            $("#three_canvas").on(
                'click',
                (e) => {

                    raycaster.setFromCamera(mouse,camera);
                    var intersects = raycaster.intersectObjects(scene.children);

                    if(intersects.length){

                        $("#interaction_alerts #alert").html("");

                        for (var i = 0; i < intersects.length; i++)

                            if(intersects[i].object.userData.markerID){

                                var markerID = intersects[i].object.userData.markerID;
                                $("#course_content").addClass("open").removeClass("close");
                                $("#course_content .head").html(markerData[markerID].headline)
                                $("#course_content .body").html(markerData[markerID].description);
                                return;

                            }

                            $("#course_content").addClass("close").removeClass("open");

                    } else {
                        $("#interaction_alerts #alert").html("get closer");
                        $("#course_content").addClass("close").removeClass("open");
                    }
                }
            );

        } // end Desktop Listeners

        renderer.setAnimationLoop(renderDesktop);

        function renderDesktop(timestamp,frame){

            const delta = clock.getDelta();
            controls.update( delta );
            renderer.render(scene, camera);

        } // end renderDesktop()

    } // end desktopScene()

}) // end onDocumentLoad()