import * as THREE from 'three';
import $ from 'jquery';

function makeRounded( ctx,radius, x, y, width, height ) {
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

function display_text(augmented_environment) {

    if (augmented_environment.intersects.length) {
        for (var i = 0; i < augmented_environment.intersects.length; i++)
            if(augmented_environment.intersects[i].object.userData.markerID){

                const object = augmented_environment.intersects[i].object;
                var markerID = object.userData.markerID;
                
                const group = new THREE.Group();

                const textMaterial = new THREE.MeshBasicMaterial( {color:0x47297B} )
                const textGeometry = new THREE.TextGeometry(
                    `${augmented_environment.markerData[markerID].headline}`,
                    {   font: augmented_environment.font,
                        size: 0.02,
                        height: 0.0001,
                        curveSegments: 2,
                        bevelEnabled: false,
                    })
                    textGeometry.center();
                const text = new THREE.Mesh(textGeometry, textMaterial)
                group.add(text);
                
                const backgroundMaterial = new THREE.MeshBasicMaterial( {color:0xFFE863 });                
                const roundedRectangle = new THREE.Shape();
                makeRounded(roundedRectangle, 0.01, 0, 0,
                    (textGeometry.boundingBox.max.x-textGeometry.boundingBox.min.x+.1),
                    (textGeometry.boundingBox.max.y-textGeometry.boundingBox.min.y+.1)
                );

                const backgroundGeometry = new THREE.ShapeGeometry(roundedRectangle);
                backgroundGeometry.center();
                const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
                group.add(background)

                group.position.set( object.position.x, object.position.y, parseFloat(object.position.z) + 0.4 );
                group.applyQuaternion( object.quaternion);
                augmented_environment.scene.add(group)
                
                return;
            }

    } 
} 

export {display_text};