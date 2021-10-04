var ideas = {}

$(document).ready(function(){
    ui_init();
});

function ui_init(){
    fetch('/journal/api/main')
        .then(response => response.json())
        .then(function(data){
            console.log(data);
            ideas = data;
            three_init();
        });
};


function three_init() {
    let camera, scene, renderer, stats;
    let mesh, geometry, material, clock;
    const worldWidth = 128, worldDepth = 128;

    const gui = new dat.GUI();

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 60, 2000 ); //near and far optimized!
    camera.position.y = 200;

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
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


    for (let i = 0; i < position.count; i ++ ) {
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
    const text_material = new THREE.MeshBasicMaterial( { color: 0x0 } );

    // here this could be improved by not changed each one!

    const loader = new THREE.FontLoader();

        loader.load( '../static/js/fonts/helvetiker_regular.typeface.json', function ( font ) {

            const textPoetry = new THREE.TextGeometry( "Poetry", {
                font: font,
                size: 30,
            } );
            const textPoetryMesh = new THREE.Mesh( text, text_material );
            textPoetryMesh.position.set(i-20,100,i*20);
            scene.add(textPoetryMesh)

            const text = new THREE.TextGeometry( "Ideas", {
                font: font,
                size: 30,
            } );
            const text_mesh = new THREE.Mesh( text, text_material );
            text_mesh.position.set(i-20,100,i*20);

            for (var i = 0; i<1;i++) {
                const text = new THREE.TextGeometry( ideas[i]["pitch"], {
                    font: font,
                    size: 30,
                } );
                const text_mesh = new THREE.Mesh( text, text_material );
                text_mesh.position.set(i-20,100,i*20);
                scene.add(text_mesh);
            }
            
        } );
    


    // POTENTIAL FOR OPTIMIZE. why create material for top and bottom, and when have to remap will take time!
    const ar_display = new THREE.PlaneBufferGeometry(128,128,4);
    const setValues = ['x','y','z'];

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
    $("#three_admin").append( gui.domElement );

    window.addEventListener( 'resize', onWindowResize );

    animate();
    curtains_off();

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
    
    }
    var i = 0;
    function animate() {
            requestAnimationFrame(animate);
        i++;
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
