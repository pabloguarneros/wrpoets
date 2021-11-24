import $ from 'jquery';
import React from "react";
import ReactDOM from "react-dom";

import { Scene } from "./three/scene.js";

import { load_models } from './load_models.js';
import { StoryCompletion } from "./story_completion.js";

$(window).on("load",function(){

  const physics_world = new CANNON.World()
  const three = new Scene(
            {dark:0xE0C3FC, light: 0x8EC5FC},
            physics_world);
  load_models(three);
  renderStories();

});;


function renderStories(){

  ReactDOM.render(
    <StoryCompletion
      this_ID={"film"}
      story_title={"On The Filmmaker's Path"}
      phrases={["Nobody puts Baby in a corner",
                "Just keep swimming",
                "You're a wizard, Harry"]}/>, 
    document.getElementById("film"));
    
  ReactDOM.render(
    <StoryCompletion
      this_ID={"life"}
      story_title={"On Pinning Down Life"}
      phrases={["Life is like a box of chocolates",
                  "Life is like riding a bicycle",
                  "Life is like a bsdook"]}/>, 
    document.getElementById("life"));

  ReactDOM.render(
    <StoryCompletion
      this_ID={"childhood"}
      story_title={"On Growing Up"}
      phrases={["Adventure is out there",
                  "Mother died today",
                  "All children, except one, grow up"]}/>, 
    document.getElementById("childhood"));

  ReactDOM.render(
    <StoryCompletion
      this_ID={"simple"}
      story_title={"On Ambiguity"}
      phrases={["He stared",
                "They drove",
                "She loved"]}/>, 
    document.getElementById("simple"));

  ReactDOM.render(
    <StoryCompletion
      this_ID={"science"}
      story_title={"On Einsteinic Forces"}
      phrases={["The vector of the electric force",
                "The magnitude of the mean fluctuation depends",
                "A homogeneous gas can be reduced isothermally"]}/>, 
    document.getElementById("science"));
}