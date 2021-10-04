import $ from "jquery";
import React from "react";

class CameraView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rooms: [], 
        };
            
    };


    componentDidMount(){

        function loadCamera(){
            
            var constraints = { audio: false, video: true };

            navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
            var video = document.querySelector('video');
            var canvas = document.querySelector('canvas');

            video.srcObject = mediaStream;
            video.onloadedmetadata = function(e) {
                this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
        const frame = this.ctx1.getImageData(0, 0, this.width, this.height);
                canvas.srcObject = video.srcObject;
            };
            })
            .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
                    }


        loadCamera();
        
    }

    render() {

        return(<div id="camera_stream" className="fr">
                WOHOOO
                <video></video>
                <canvas></canvas>
            </div>
            )
    }

};

export {CameraView};
