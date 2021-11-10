import $ from "jquery";
import { load_models } from './load_models.js';
import { Scene } from './scene.js';
import {fetch_html_media} from './load_html_media.js';

$(window).on("load",function(){
  const three = new Scene({dark:0x9EE482, light: 0x87DF9E});
  load_models(three.scene, three.world, three.models_to_explore, three.physics_objects);
  fetch_html_media();
});