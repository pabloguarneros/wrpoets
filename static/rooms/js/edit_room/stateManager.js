import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';

async function fetchNodes(){
    const api = `/nubes/nodes/${window.location.href.substring(window.location.href.lastIndexOf('/') + 1)}`;
    fetch(api)
        .then( response => response.json() )
        .then( (data) => { initialize_scene(data, ARButton) });
    };

$(document).ready(function(){
    fetchNodes();
});