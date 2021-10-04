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
        raycaster = new THREE.Raycaster();
    
        var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        light.position.set(0.5, 1, 0.25);
        scene.add(light);
    
        loadOrbs();
    
        function loadOrbs(){
    
            const defaultGeometry = new THREE.SphereBufferGeometry(.14,40,40);
            const defaultMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(0xF5BD1F) });

            markerData = [];

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
    
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            phoneScene();
        }else{
            desktopScene();
        }
    
    } // end three_init

    function phoneScene(){
        
        let link_obj = {"bg_obj": null, "text_obj": null};
        let controller, font, intersects;
        const fontLoader = new THREE.FontLoader()
        fontLoader.load(
            '/static/js/fonts/helvetiker_regular.typeface.json',
            function(helvetiker){
                font = helvetiker;
            })

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.xr.enabled = true;
        $("#center_scene").append( renderer.domElement );
        const poemDarkMaterial = new THREE.MeshBasicMaterial({
            color:0x47297B,
        })
        const poemLightMaterial = new THREE.MeshBasicMaterial({
            color:0xFFE863,
        })
        
        $("#ar_button")[0].appendChild(ARButton.createButton(renderer));
        $("#ARButton").on("click",()=>{
            $("#home_wrapper").append( $("#center_scene") );
            $("#home_wrapper").addClass("phone");
            $("#top_block").html("");
            $("#left_block").html("");
            $("#right_block").html("");
            $("#middle_circle").html("");
            $("svg").replaceWith("<div id='identify_hit'></div>");
        })

        controller = renderer.xr.getController(0);
        scene.add(controller);
        controller.addEventListener('select', readPoem);


        function readPoem() {

            if(intersects.length){
                for (var i = 0; i < intersects.length; i++)
                    if(intersects[i].object.userData.markerID){
                        var markerID = intersects[i].object.userData.markerID;
                        const poemGeometry = new THREE.TextGeometry(
                            "Visit: ".concat(markerData[markerID].title),
                            {
                                font: font,
                                size: 0.02,
                                height: 0.0001,
                                curveSegments: 2,
                                bevelEnabled: false,
                            }
                        )
                        poemGeometry.center();

                        const poem = new THREE.Mesh(poemGeometry, poemLightMaterial)
                        poem.position.set( 0, 0, .01 )

                        const roundedRectShape = new THREE.Shape();

                        function roundedRect( ctx, x, y, width, height, radius ) {
        
                            ctx.moveTo( x, y + radius );
                            ctx.lineTo( x, y + height - radius );
                            ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
                            ctx.lineTo( x + width - radius, y + height );
                            ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
                            ctx.lineTo( x + width, y + radius );
                            ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
                            ctx.lineTo( x + radius, y );
                            ctx.quadraticCurveTo( x, y, x, y + radius );
        
                        }
                        roundedRect(roundedRectShape,
                            0,
                            0,
                            (poemGeometry.boundingBox.max.x-poemGeometry.boundingBox.min.x+.1),
                            (poemGeometry.boundingBox.max.y-poemGeometry.boundingBox.min.y+.1),
                            .01 );

                        const bg_geometry = new THREE.ShapeGeometry(roundedRectShape);
                        bg_geometry.center();   
    
                        const poem_bg = new THREE.Mesh(bg_geometry, poemDarkMaterial)
                        poem_bg.position.set( 0, 0, - 0.46 ).applyMatrix4( controller.matrixWorld );
                        poem_bg.userData= { getPoem: `${markerData[markerID].pk}`};      
                        poem_bg.quaternion.setFromRotationMatrix( controller.matrixWorld );

                        poem_bg.add(poem);
                        scene.add(poem_bg);

                    }  else if (intersects[i].object.userData.getPoem) {
                        window.location.href=(`${window.location.origin.concat(`/room/${intersects[i].object.userData.getPoem}`)}`);
                    }
            } // end if intersects

        } // end readPoem

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

            raycaster.set(cameraPosition,cameraDirection);
                
            intersects = raycaster.intersectObjects(scene.children);

            if(intersects.length){
                for (var i = 0; i < intersects.length; i++){
                    if(intersects[i].object.userData.markerID){
                        tabFound() ;
                    } else if (intersects[i].object.userData.getPoem){
                        tabHover();
                    }
                }
            } else{ tabNotFound() };

            function tabFound(){
                $("#identify_hit").css("border-color","#FBD748");
            }

            function tabHover(){
                link_obj["bg_obj"] = intersects[i].object
                link_obj["bg_obj"].material = poemLightMaterial;
                link_obj["text_obj"] = intersects[i].object.children[0];
                link_obj["text_obj"].material = poemDarkMaterial; 
            }

            function tabNotFound(){
                $("#identify_hit").css("border-color","#47297B");
                if (link_obj["bg_obj"]){
                    link_obj["bg_obj"].material = poemDarkMaterial;
                    link_obj["text_obj"].material = poemLightMaterial;
                    link_obj["bg_obj"] = null;
                    link_obj["text_obj"] = null
                }
            }

            renderer.render(scene, camera);
        }

    }  // end phoneScene

    function desktopScene(){
        
        scene.fog = new THREE.FogExp2( 0x47297B, .6 );
        var mouse = new THREE.Vector2();
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 40);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 

        // CONTROLS
        const controls = new FirstPersonControls( camera, $("#home_wrapper")[0] );
        controls.movementSpeed = 1;
        controls.lookSpeed = .03;

        $("#center_scene").append( renderer.domElement );
        
        desktopListeners();

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
                            $("#browse_heading a").attr("href",`${window.location.origin.concat(`/room/${markerData[markerID].pk}`)}`);
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

        renderer.setAnimationLoop(renderDesktop);

        function renderDesktop(timestamp,frame){
            const delta = clock.getDelta();
            controls.update( delta );
            renderer.render(scene, camera);
        } // end renderDesktop


    } // end desktopScene

})// end onDocumentLoad
