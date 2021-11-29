import $ from 'jquery';
import { CSS2DRenderer } from 'three/examples/js/renderers/CSS2DRenderer.js';

class Render{

    constructor (){
        this.three = new THREE.WebGLRenderer({antialias:true, alpha:true});
        this.label = new THREE.CSS2DRenderer();
        this.resize = this.resize.bind(this);
        this.setSettings();

    }

    setSettings(){
        this.three.shadowMap.enabled = true;
        this.three.setPixelRatio( window.devicePixelRatio );
        this.three.setSize( window.innerWidth, window.innerHeight );
        this.label.setSize( window.innerWidth, window.innerHeight );
		this.label.domElement.style.position = 'absolute';
		this.label.domElement.style.top = '0px';
        $("#three_canvas").append( this.three.domElement );
		document.body.appendChild( this.label.domElement );
    }

    resize(){
        this.three.setSize( window.innerWidth, window.innerHeight );
        this.label.setSize( window.innerWidth, window.innerHeight );
    }

    render(scene, camera){
        this.three.render(scene, camera);
        this.label.render(scene, camera );
    }

}

export {Render};