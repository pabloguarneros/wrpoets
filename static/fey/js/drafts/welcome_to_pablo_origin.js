function load_three(){

    // Canvas
    const canvas = document.querySelector('canvas.webgl')
    // Scene
    const scene = new THREE.Scene();

    const gui = new dat.GUI();

    const bubbleMaterial = new THREE.MeshPhongMaterial()
    bubbleMaterial.color = new THREE.Color(0xffffff)
    bubbleMaterial.shininess = 0;

    const bubble = new THREE.Mesh(
            new THREE.IcosahedronGeometry(12),
            bubbleMaterial);

    bubble.position.set(30,30,30);
    scene.add(bubble);

    //loader.load('fonts/helvetiker_regular.typeface.json,function(font))

    const text = new THREE.TextGeometry('Pablo Guarneros',{
        size: 40.2,
        height: 1,
        curveSegments: 20,
        bevelEnabled: true,
        bevelThickness: 0.8,
        bevelSize: 0.58,
        bevelOffset: 0,
        bevelSegments: 4
    })

    const text_mesh = new THREE.Mesh(
        text,
        bubbleMaterial);
    scene.add(text_mesh);

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    const ambientLight = new THREE.AmbientLight( 0xb1b1ff );
    scene.add(ambientLight);

    const ambientLightParameters = {
        color: 0xb1b1ff
    }
    gui
        .addColor(ambientLightParameters,'color')
        .onChange(() => {
            ambientLight.color.set(ambientLightParameters.color)
        })
    .name(`Ambient Color`)


    const light1 = new THREE.PointLight(0x15b9, 2);
    light1.position.set(-8,-83,220)
    light1.intensity = 1.44;
    scene.add(light1);
    const lightOneParameters = {
        color: 0x15b9
    }
    gui.addColor(lightOneParameters,'color')
        .onChange(() => {
            light1.color.set(lightOneParameters.color)
        })
        .name(`Color for Light 1`)

    const light2 = new THREE.PointLight(0xff0000, 2);
    light2.position.set(-900,500,8);
    light2.intensity = 0;
    scene.add(light2);
    const lightTwoParameters = {
        color: 0xff0000
    }
    gui.addColor(lightTwoParameters,'color')
        .onChange(() => {
            light2.color.set(lightTwoParameters.color)
        })
        .name(`Color for Light 2`)

    const light3 = new THREE.PointLight(0xff2088, 2);
    light3.position.set(-296,500,8);
    light3.intensity = 1.5;
    scene.add(light3);
    const lightThreeParameters = {
        color: 0xff2088
    }
    gui.addColor(lightThreeParameters,'color')
        .onChange(() => {
            light3.color.set(lightThreeParameters.color)
        })
        .name(`Color for Light 3`)

    const lights = {
        light1: light1,
        light2: light2,
        light3: light3
    }
    // light GUI
    for (var key in lights){
        gui
            .add(lights[key], 'intensity')
            .min(0)
            .max(3)
            .step(0.04)
            .name(`${key}: intensity`)

        gui
            .add(lights[key].position, 'x')
            .min(-900)
            .max(500)
            .step(1)
            .name(`${key}: x`)
        gui
            .add(lights[key].position, 'y')
            .min(-900)
            .max(500)
            .step(1)
            .name(`${key}: y`)
        gui
            .add(lights[key].position, 'z')
            .min(-900)
            .max(500)
            .step(1)
            .name(`${key}: z`)
        }

    // Camera
    const camera = new THREE.PerspectiveCamera(15, sizes.width / sizes.height, 0.1, 2000)

    camera.position.x = 300
    camera.position.y = 211
    camera.position.z = 171

    scene.add(camera)

    gui
        .add(camera.position,'x')
        .min(0)
        .max(300)
        .step(.1)
        .name('camera: x')
    gui
        .add(camera.position,'y')
        .min(0)
        .max(300)
        .step(.1)
        .name('camera: y')
    gui
        .add(camera.position,'z')
        .min(-400)
        .max(400)
        .step(.5)
        .name('camera: z')

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha:true,
        antialias: true
    })

    renderer.setSize(sizes.width, sizes.height)

    const controls = new THREE.OrbitControls( camera, canvas);
    controls.enableDamping = true;


    const clock = new THREE.Clock()

    function tick() {

        requestAnimationFrame( tick );
        controls.update();
        //controls.update();
        const elapsedTime = clock.getElapsedTime()
    
        renderer.render( scene, camera );

    }

    tick()

}

document.addEventListener('DOMContentLoaded', load_three, false);
