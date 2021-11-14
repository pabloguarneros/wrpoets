import $ from 'jquery';
import React from "react";
import ReactDOM from "react-dom";

import { Scene } from "../../minervaremote/js/scene.js";
import { load_models } from './load_models.js';

import {SkaldModule} from "./skald_module.js";

$(window).on("load",function(){

  const physics_world = new CANNON.World()
  const three = new Scene(
            {dark:0xE0C3FC, light: 0x8EC5FC},
            physics_world);
  load_models(three.scene, three.world, three.models_to_explore, three.physics_objects);
  ReactDOM.render(<SkaldModule />, document.getElementById("skald_module"));

});;