import React from "react";
import ReactDOM from "react-dom";
import { CSS2DObject } from 'three/examples/js/renderers/CSS2DRenderer.js';

function NodeContent(props) { // always static
    return (
      <div className="textNode">
        <p className="title">{props.title}</p>;
        <p className="text">{props.text}</p>;
      </div>
    );
  }

function createTextNode(props){
    const div = document.createElement( 'div' );
    ReactDOM.render(
        <NodeContent title={props.title} text={props.text} />,
        div)
      const textObject = new THREE.CSS2DObject( div );
      textObject.position.set(  props.position.x,
                                props.position.y,
                                props.position.z );
    return textObject
}
    
export { createTextNode }
  