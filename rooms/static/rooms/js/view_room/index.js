import $ from "jquery";
import {Augmented_Environment} from "../../../../../static/three_xr/on_load/build_environment.js";

$( document ).ready(function() {
    const environment = new Augmented_Environment("images", "explore");
    environment.build();
 });
