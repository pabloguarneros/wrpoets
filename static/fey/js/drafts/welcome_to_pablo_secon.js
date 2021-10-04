let camera, controls, scene, renderer, stats;
let mesh, geometry, material, clock;
const worldWidth = 128, worldDepth = 128;

$(document).ready(function(){
    init();
    animate();
});

function init() {

    const gui = new dat.GUI();

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.y = 200;

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x0 );
    var scene_bg_parameters = {
        color: 0x0,
    }
    gui.addColor(scene_bg_parameters,'color')
        .onChange(() => {
            scene.background = new THREE.Color(scene_bg_parameters.color)
        })
        .name(`BackgroundColor`)

    scene.fog = new THREE.FogExp2( 0xcdcdcd, 0.0007 );
    var fog_bg_parameters = {
        color: 0xb34f4f,
    }
    gui.addColor(fog_bg_parameters,'color')
        .onChange(() => {
            scene.fog.color.set(fog_bg_parameters.color)
        })
        .name(`FogColor`)

    geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
    geometry.rotateX( - Math.PI / 2 );
    const position = geometry.attributes.position;
    position.usage = THREE.DynamicDrawUsage;

    // here this could be improved by not changed each one!
    for ( let i = 0; i < position.count; i ++ ) {
        const y = 40 * Math.random();
        position.setY( i, y );
    }

    material = new THREE.MeshBasicMaterial( { color: 0x0 } );
    material.wireframe = true;
    const materialParameters = {
        color: 0x00044ff
    }
    gui
        .addColor(materialParameters,'color')
        .onChange(()=>{
            material.color.set(materialParameters.color)
        })
        .name('MeshColor')

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    // POTENTIAL FOR OPTIMIZE. why create material for top and bottom, and when have to remap will take time!
    const ar_display = new THREE.BoxBufferGeometry(200,200,20);
    const setValues = ['x','y','z'];

    // POTENTIAL FOR OPTIMIZE: create only one draw with the scene add group!
    const writing_texture = new THREE.TextureLoader().load( 'static/patterns/pattern-writing-resized.png' );
    const writing_pattern = new THREE.MeshBasicMaterial( { map: writing_texture } );
    const writing_mesh = new THREE.Mesh(ar_display,writing_pattern);
    writing_mesh.position.set(-2702,322,-5726);
    for (var i in setValues){
        gui
            .add(writing_mesh.position,setValues[i])
            .min(-6000)
            .max(3000)
            .name("writing ".concat(setValues[i]))
        }
    scene.add(writing_mesh);

    const ideas_texture = new THREE.TextureLoader().load( 'static/patterns/pattern-ideas-resized.png' );
    const ideas_pattern = new THREE.MeshBasicMaterial( { map: ideas_texture } );
    const ideas_mesh = new THREE.Mesh(ar_display,ideas_pattern);
    ideas_mesh.position.set(203,290,-2000)
    for (var i in setValues){
        gui
            .add(ideas_mesh.position,setValues[i])
            .min(-2000)
            .max(2000)
            .name("ideas ".concat(setValues[i]))
        }
    scene.add(ideas_mesh);

    const projects_texture = new THREE.TextureLoader().load( 'static/patterns/pattern-projects-resized.png' );
    const projects_pattern = new THREE.MeshBasicMaterial( { map: projects_texture } );
    const projects_mesh = new THREE.Mesh(ar_display,projects_pattern);
    projects_mesh.position.set(-274,203,-881)
    for (var i in setValues){
        gui
            .add(projects_mesh.position,setValues[i])
            .min(-2000)
            .max(2000)
            .name("projects ".concat(setValues[i]))
        }
    scene.add(projects_mesh);
    
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    $("#three_canvas").append( renderer.domElement );

    controls = new FirstPersonControls( camera, renderer.domElement );

    controls.movementSpeed = 500;
    //controls.lookSpeed = 0.1;
    controls.lookSpeed = 0.001;
    controls.constrainVertical = true;
    controls.lookVertical = false;


    stats = new Stats();
    $("#three_admin").append( stats.dom );
    $("#three_admin").append( gui.domElement );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    const delta = clock.getDelta();
   

    controls.update( delta );
    renderer.render( scene, camera );

}


class Home extends React.Component {
    

    constructor(props) {
        super(props);

        this.state = {
            loaded:false,
            ideas: [],

        };

        this.handleChange = this.handleChange.bind(this);
    };

    componentDidMount(){
        const tag_api = "/notebook/api/main";
        fetch(tag_api)
            .then((response) => response.json())
            .then ((data) => 
                this.setState(({
                    ideas: data,
                    loaded: true
                }))
            );
        
    };

    render() {
        if (this.state.loaded){
            return this.renderCreate();
        }
        else {
            return this.renderTitle();
            //tags to help you select movies in next step
        }
    }

    renderCreate(){
        return(
            <div class="home_react">
                <button id="collection_start" className="cent" onClick={this.nextBTN}>
                    Create New Collection
                </button>
            </div>
        )
    }

    renderTitle(){
        return(
            <div id="scene2" className="ac fc cent">
                <h2> Name Your Collection </h2>
                <div className="fr">
                    <label>
                        <input type="text" value={this.state.name} name="name" onChange={this.handleChange} />
                    </label>
                </div>
                <button className="next_BTN" onClick={this.nextBTN}>
                    Next
                </button>
            </div>
        )
    }

    renderTag(){
        $(document).ready(function() {
            $('#tag_select').select2();
        });
        return(
            <div id="scene3" className="ac fc cent">
                    <h2> Tag It </h2>
                    <label>
                    <select id="tag_select" className="form-group" multiple={true} value={this.state.tag_select} onChange={this.handleTags}>
                        {this.state.tags.map((value, index) => {
                            var name = this.state.tags[index]["name"];
                        return <option value={name}>{name}</option>
                        })}
                    </select>
                    </label>
                <button class="next_BTN" onClick={this.handleTags}>
                    Next
                </button>
            </div>
        )

    }

    handleFilmLoad(){
        const tags = this.state.tag_select;
        // var url = "http://127.0.0.1:8000/search/api/film_by_tag?&tag="

        var url = "/search/api/film_by_tag?&tag="
        for (var i=0; i < tags.length; i++){
            if (i == 0){
                url = url.concat("",tags[i])
            }else{
                url = url.concat(",",tags[i])
            }
        };
        const fetchFilm = async () => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    var easy_f = [];
                    for (var i = 0; i < data.length; i++){
                        const movie_ID = data[i]["movie_ID"];
                        const image = new Image().src=data[i]["poster_pic"];
                        easy_f.push([movie_ID,image]);
                        };
                    this.setState({
                        easy_f: easy_f,
                        loaded:true
                        })
                });
        };
        fetchFilm();
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
      } 

    handleSubmit(event) {
        event.preventDefault();
        var movie_IDs = this.state.on_coll.map(element=>element[0]);
        $.ajaxSetup({ 
            beforeSend: function(xhr, settings) {
                function getCookie(name) {
                    var cookieValue = null;
                    if (document.cookie && document.cookie != '') {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = jQuery.trim(cookies[i]);
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                    // Only send the token to relative URLs i.e. locally.
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            } 
        });
        $.ajax( 
        { 
            url: `/tribe/create_collection`,
            type:"POST", 
            data:{ 
                name:this.state.name,
                movie_ID:movie_IDs,
                description:this.state.description,
                tags:this.state.tag_select,
                privacy:this.state.privacy,
                }, 
        
        success: function() {
            $("#create_collection").replaceWith("<div><h2> Awesomely! We got your collection! </h2></div>");
        }
    });

      }

}

ReactDOM.render(<Home />, document.querySelector("#react_cont"));