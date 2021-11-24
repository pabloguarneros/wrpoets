import $ from 'jquery';

import { load_physics } from "../../atlahua/js/three/render_physics";
import { Scene } from "../../atlahua/js/three/scene.js";

import { load_models } from './load_models.js';
import { load_font } from './load_text.js';

$(window).on("load",function(){
  const physics_world = new CANNON.World()
  const three = new Scene(
            {dark:0x4A9B7F, light: 0x0A3431},
            physics_world);
  load_models(three.scene, three.world, three.models_to_explore, three.physics_objects);
  load_font(three);
  //load_physics(physics_world);
});;