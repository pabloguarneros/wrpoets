import $ from "jquery";

async function loadCamera(element, three_canvas){
    var video = document.querySelector(element);
    if (navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                if ('srcObject' in video) {
                    video.srcObject = stream;
                    $(video).parent().addClass("reveal");
                    video.addEventListener('loadeddata', function(event){
                        three_canvas.video = video;
                        three_canvas.loadGestures();
                    });
                } else{
                    video.src = URL.createObjectURL(mediaSource);
                }
            })
            .catch(function (err0r) {
                console.log("Something went wrong!")
            })
    };
}

export { loadCamera };