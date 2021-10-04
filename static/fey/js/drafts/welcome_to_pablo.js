$(document).ready(function(){
    ui_init();
    three_init();
});

function ui_init(){
    $("#ich").on("click",function(){
        if ($("#ich").hasClass("ich_on")){
            $("#name_slider").addClass("slider_on").removeClass("slider_off");
            $("#ich").addClass("ich_off").removeClass("ich_on");
        }else{
            $("#name_slider").addClass("slider_off").removeClass("slider_on");
            $("#ich").addClass("ich_on").removeClass("ich_off");
        }
    })
    $(document).on("click",function(e){
        if ($("#ich").hasClass("ich_off")&(!$(e.target).is("#ich h1,#ich,#name_slider"))){
            $("#name_slider").addClass("slider_off").removeClass("slider_on");
            $("#ich").addClass("ich_on").removeClass("ich_off");
        }});
};


function three_init() {
    let camera, scene, renderer, stats;
    let mesh, geometry, material, clock;
    const worldWidth = 128, worldDepth = 128;

    //const gui = new dat.GUI();

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 60, 2000 ); //near and far optimized!
    camera.position.y = 200;

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    var scene_bg_parameters = {
        color: 0xffffff,
    }
    /*gui.addColor(scene_bg_parameters,'color')
        .onChange(() => {
            scene.background = new THREE.Color(scene_bg_parameters.color)
        })
        .name(`BackgroundColor`)
    */
    scene.fog = new THREE.FogExp2( 0xffffff, 0.0007 );
    var fog_bg_parameters = {
        color: 0xffffff,
    }
    /*gui.addColor(fog_bg_parameters,'color')
        .onChange(() => {
            scene.fog.color.set(fog_bg_parameters.color)
        })
        .name(`FogColor`)
    */
    geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
    geometry.rotateX( - Math.PI / 2 );
    const position = geometry.attributes.position;
    position.usage = THREE.DynamicDrawUsage;

    // here this could be improved by not changed each one!
    for ( let i = 0; i < position.count; i ++ ) {
        const y = 100 * Math.random();
        position.setY( i, y );
    }
    

    material = new THREE.MeshBasicMaterial( { color: 0x0 } );
    material.wireframe = true;
    const materialParameters = {
        color: 0x0
    }
    /*
    gui
        .addColor(materialParameters,'color')
        .onChange(()=>{
            material.color.set(materialParameters.color)
        })
        .name('MeshColor')
    */
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    // POTENTIAL FOR OPTIMIZE. why create material for top and bottom, and when have to remap will take time!
    const ar_display = new THREE.PlaneBufferGeometry(128,128,4);
    const setValues = ['x','y','z'];

    // instantiate a loader
    const loader = new THREE.ImageLoader();

        // load a image resource
        loader.load(
            // resource URL
            'static/patterns/pattern-writing-resized.png',

            // onLoad callback
            function ( image ) {
                // use the image, e.g. draw part of it on a canvas
                const canvas = document.createElement( 'canvas' );
                const context = canvas.getContext( '2d' );
                context.drawImage( image, 100, 100 );
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function () {
                console.error( 'An error happened.' );
            }
        );

    const writing_texture = new THREE.TextureLoader().load( 'static/patterns/pattern-writing-resized.png' );
    const writing_pattern = new THREE.MeshBasicMaterial( { map: writing_texture } );
    const writing_mesh = new THREE.Mesh(ar_display,writing_pattern);
    writing_mesh.position.set(-556,225,-2409);
    /*
    for (var i in setValues){
        gui
            .add(writing_mesh.position,setValues[i])
            .min(-6000)
            .max(3000)
            .name("writing ".concat(setValues[i]))
        }
    */
    scene.add(writing_mesh);

    const ideas_texture = new THREE.TextureLoader().load( 'static/patterns/pattern-ideas-resized.png' );
    const ideas_pattern = new THREE.MeshBasicMaterial( { map: ideas_texture } );
    const ideas_mesh = new THREE.Mesh(ar_display,ideas_pattern);
    ideas_mesh.position.set(203,246,-2000)
    /*
    for (var i in setValues){
        gui
            .add(ideas_mesh.position,setValues[i])
            .min(-2000)
            .max(2000)
            .name("ideas ".concat(setValues[i]))
        }
    */
    scene.add(ideas_mesh);


    const projects_texture = new THREE.TextureLoader().load( 'static/patterns/pattern-projects-resized.png' );
    const projects_pattern = new THREE.MeshBasicMaterial( { map: projects_texture } );
    const projects_mesh = new THREE.Mesh(ar_display,projects_pattern);
    projects_mesh.position.set(-274,203,-881)
    /*
    for (var i in setValues){
        gui
            .add(projects_mesh.position,setValues[i])
            .min(-2000)
            .max(2000)
            .name("projects ".concat(setValues[i]))
        }
    */
    scene.add(projects_mesh);
    
    renderer = new THREE.WebGLRenderer({
        powerPreference: 'high-performance',
    })
    
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.autoUpdate = false;

    const controls = new FirstPersonControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', () => renderer.render( scene, camera ) );
    controls.movementSpeed = 500;
    controls.lookSpeed = 0.001;
    //controls.constrainVertical = true;
    controls.lookVertical = false;

    stats = new Stats();

    $("#three_canvas").append( renderer.domElement );
    //$("#three_admin").append( stats.dom );
    //$("#three_admin").append( gui.domElement );

    window.addEventListener( 'resize', onWindowResize );

    animate();
    curtains_off();

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
    
    }
    
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        controls.update( delta );
        renderer.render( scene, camera );
        //stats.update();

    }
    
    function curtains_off() {
        $('#home_loader').css("animation","curtain_off 1s ease 1s 1 forwards")
        $('#home_loader').on("animationend",function(e){
            $('#home_loader').css("display","none");
        })
    }
    

}
