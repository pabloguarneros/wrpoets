import $ from 'jquery';
import { load_models } from './load_models.js';
import { loadFont } from './load_text.js';
import { render_physics } from "./render_physics.js";
import { Scene } from "../../minervaremote/js/scene.js";

$(window).on("load",function(){
  const physics_world = new CANNON.World()
  const three = new Scene(
            {dark:0x4A9B7F, light: 0x0A3431},
            physics_world);
  load_models(three.scene, three.world, three.models_to_explore, three.physics_objects);
  loadFont(three.scene, three.models_to_explore);
  //render_physics(physics_world);
});;