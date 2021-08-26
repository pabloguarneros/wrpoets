let scene, clock, camera, renderer, raycaster, markerData;
let controller, font, intersects, dragged_object;
var dragging=false;

function initialize_scene(nodeArray, ARButton) {

    $("head").append("<meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>");
    
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;

    raycaster = new THREE.Raycaster();

    $("#three_canvas").append( renderer.domElement );
    $("#main_instructions").html("");
    document.body.appendChild(ARButton.createButton(renderer));

    controller = renderer.xr.getController(0);
    scene.add(controller);

    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    const fontLoader = new THREE.FontLoader()
    fontLoader.load(
        '/static/js/fonts/helvetiker_regular.typeface.json',
        function(helvetiker){
            font = helvetiker;
        })

    loadUserObjects(nodeArray);

    initializeEventListeners(nodeArray);

    animate();

    function animate(){
        renderer.setAnimationLoop(render);
    }

}