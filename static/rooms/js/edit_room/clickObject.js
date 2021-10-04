function clickObject() {
    if (intersects.length) {
        for (var i = 0; i < intersects.length; i++)
            if(intersects[i].object.userData.markerID){
                var markerID = intersects[i].object.userData.markerID;

                // Poem Render
                const poemGeometry = new THREE.TextGeometry(
                    `${markerData[markerID].headline} \n \n ${markerData[markerID].description}`,
                    {
                        font: font,
                        size: 0.02,
                        height: 0.0001,
                        curveSegments: 2,
                        bevelEnabled: false,
                    }
                )
               
                poemGeometry.center();
                const poemDarkMaterial = new THREE.MeshBasicMaterial({
                    color:0x47297B,
                })
                const poemLightMaterial = new THREE.MeshBasicMaterial({
                    color:0xFFE863,
                })

                const poem = new THREE.Mesh(poemGeometry, poemDarkMaterial)
                poem.position.set( 0, 0, - 0.65 ).applyMatrix4( controller.matrixWorld );
                poem.quaternion.setFromRotationMatrix( controller.matrixWorld );

 
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

                const poem_bg = new THREE.Mesh(bg_geometry, poemLightMaterial)
                poem_bg.position.set( 0, 0, - 0.66 ).applyMatrix4( controller.matrixWorld );
                poem_bg.quaternion.setFromRotationMatrix( controller.matrixWorld );

                scene.add(poem);
                scene.add(poem_bg);
                
                return;
            }

    } // endif
} // end readPoem()