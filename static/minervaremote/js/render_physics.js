function render_physics(world, physics_objects, delta){
    world.step(1/24, delta, 3);
    for (var i = 0; i < physics_objects.length; i++){
        physics_objects[i]["model"].position.copy(
            physics_objects[i]["physics"].position);
    }
}
export {render_physics};