class Raycaster {

    constructor(props) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.three = props.three;
        this.textNodes = props.textNodes;

        this.onClick = this.onClick.bind(this);
        this.addEventListeners();
    }

    addEventListeners(){
        document.addEventListener( 'click', 
          (e) => {this.onClick(e)}, false);
        document.addEventListener( 'mousedown',  (e)=>{console.log("wohoo")});
      }
  
    onClick( e ) {
        e.preventDefault();
        this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.three.camera );
        const intersections = this.raycaster.intersectObjects( this.three.scene.children, true );
        if ( intersections.length > 0 ) {
          const object = intersections[ 0 ].object;
          object.scale.set(1.2,1.2,1.2);
          if (this.textNodes.get(object.userData.pk)) {
            this.textNodes.get(object.userData.pk).position.set(12,0,-24);
          }
        }
      }


}

export {Raycaster}