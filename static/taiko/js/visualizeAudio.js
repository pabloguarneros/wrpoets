class audioVisualizer{
    constructor(){
        
    }

    loadAudio(){
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var distortion = audioCtx.createWaveShaper();
        var analyser = audioCtx.createAnalyser();
        var video = document.getElementById('user_video');
        const source = audioCtx.createMediaElementSource(video);
        source.connect(analyser);
        analyser.connect(distortion);
        distortion.connect(audioCtx.destination);
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
    
        analyser.getByteTimeDomainData(dataArray);
        analyser.fftSize = 2048;
    
        var canvas = document.querySelector('#audio_visual');
        var canvasCtx = canvas.getContext("2d");
        const HEIGHT = 256;
        const WIDTH = 2000;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for(var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
            canvasCtx.moveTo(x, y);
            } else {
            canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
        };

    }

    export {audioVisualizer};