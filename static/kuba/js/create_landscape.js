import $ from 'jquery';
import { load_models } from './load_models.js';
import { loadFont } from './load_text.js';
import { Scene } from "../../minervaremote/js/scene.js";

$(window).on("load",function(){
  const physics_world = new CANNON.World()
  const three = new Scene(
            {dark:0x4A9B7F, light: 0x0A3431},
            physics_world);
  load_models(three.scene, three.world, three.models_to_explore, three.physics_objects);
  loadFont(three.scene, three.models_to_explore);
  /*render_physics(physics_world);*/
});;

function render_physics(world){
  world.gravity.set(0, -9.82, 0);

  // Materials
  const defaultMaterial = new CANNON.Material('default');

  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1, // if less friction, more oily!
      restitution: 0.7, // more bouncy if higher
    }
  )
  world.addContactMaterial(defaultContactMaterial)
  world.defaultContactMaterial = defaultContactMaterial;

  const sphereShape = new CANNON.Sphere(0.9); // should be same radius as soccer ball!
  const sphereBody = new CANNON.Body({
    mass: 1, // mass of object
    position: new CANNON.Vec3(-11,20,9),
    shape: sphereShape,
  });
  sphereBody.id="soccer_ball";
  world.addBody(sphereBody);

  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body();
  floorBody.mass = 0; // mass 0 so object is static!
  floorBody.addShape(floorShape);
  floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI*0.5
  )
  world.addBody(floorBody);

}
