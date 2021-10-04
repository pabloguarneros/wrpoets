
async function loadCamera(element){
    var video = document.querySelector(element);
    if (navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({ video: {facingMode: "landscape"}, audio: true })
            .then(function (stream) {
                if ('srcObject' in video) {
                    video.srcObject = stream;
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