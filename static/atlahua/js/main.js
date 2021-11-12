import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import {SkaldModule} from "./skald_module.js";

$(document).ready(function(){
    ReactDOM.render(<SkaldModule />, document.getElementById("skald_module"));
});
