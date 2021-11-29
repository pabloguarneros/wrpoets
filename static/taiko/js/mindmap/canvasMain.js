import $ from 'jquery';
import {ThreeCanvas} from './threeCanvas.js';
import { Raycaster } from './raycaster.js';
import { createObjects } from './createObjects.js'
import { data } from './data.js';

$(window).on("load",function(){
  const three = new ThreeCanvas();
  const [textNodes, threeNodes] = createObjects(data);
  threeNodes.forEach((node)=>three.scene.add(node));
  textNodes.forEach((node, pk) =>three.scene.add(node));
  const raycaster = new Raycaster({three:three,textNodes:textNodes})
});;


