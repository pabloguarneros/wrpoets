import $ from "jquery";
import {Augmented_Environment} from "../../../three_xr/on_load/build_environment.js";

$( document ).ready(function() {
    const room_pk = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    const environment = new Augmented_Environment("images", "explore",room_pk);
    environment.build("#augmented_canvas");
 });
