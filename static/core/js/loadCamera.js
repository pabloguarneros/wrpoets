async function loadCamera(element, withAudio=false){
    var video = document.querySelector(element);
    if (navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({ video: true, audio: withAudio })
            .then(function (stream) {
                if ('srcObject' in video) {
                    video.srcObject = stream;
                    video.addEventListener('loadeddata', function(event){
                        console.log("image_loaded")
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