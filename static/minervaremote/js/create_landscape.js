import $ from "jquery";
import { Scene } from '../../atlahua/js/three/scene.js';
import { load_models } from './load_models.js';
import {fetch_html_media} from './load_html_media.js';

$(window).on("load",function(){
  const three = new Scene({dark:0x9EE482, light: 0x87DF9E});
  load_models(three);
  fetch_html_media();
});