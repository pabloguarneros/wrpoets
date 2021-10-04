
async function loadCamera(){
    var video = document.querySelector("#webcam");
    if (navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({ video: {facingMode: "user"}, audio: false })
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