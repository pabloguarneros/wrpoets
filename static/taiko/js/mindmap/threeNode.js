function createThreeNode(props){
    const geometry = new THREE.CircleGeometry( 5, 60 );
    const material = new THREE.MeshToonMaterial( { color: 0xdedede } );
    const circle = new THREE.Mesh( geometry, material );
    circle.userData.pk = props.pk;
    circle.position.set(props.position.x,
                        props.position.y,
                        props.position.z);
    return circle
}

export { createThreeNode };