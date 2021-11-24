function createAnimation(mesh, startPosition, endPosition){
    var track = new THREE.VectorKeyframeTrack(
      '.position',
      [0, 1],
      [
        startPosition.x,
        startPosition.y,
        startPosition.z,
        endPosition.x,
        endPosition.y,
        endPosition.z,
      ]
    );
    var animationClip = new THREE.AnimationClip(null, 1, [track]);
    var animationAction = mesh.userData.mixer.clipAction(animationClip);
    animationAction.setLoop(THREE.LoopOnce);
    animationAction.play();
  };

  export {createAnimation};
