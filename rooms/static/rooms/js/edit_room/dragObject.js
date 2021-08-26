function dragObject(object) {
    object.position.set(0, 0, - 1).applyMatrix4( controller.matrixWorld );
    object.quaternion.setFromRotationMatrix( controller.matrixWorld );
} // end readPoem()