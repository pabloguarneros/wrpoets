import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import Jimp from 'jimp';
import { loadCamera } from '../../core/js/loadCamera';
import { loadAudio } from './visualizeAudio.js';

  class VideoInput extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            matrix:[[1, 44, 0], [-22, -2, -22], [0, 44, -44]],
            isModelLoaded: false,
        };
        this.modelLoaded = this.modelLoaded.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.capture = this.capture.bind(this);
        this.convolution = this.convolution.bind(this);
        this.catify = this.catify.bind(this);

        this.pix2pix = ml5.pix2pix('../static/machine_learning/models/edges2pikachu_AtoB.pict/', this.modelLoaded);

    };

    handleChange(event){
        const key = event.target.name.split(',');
        const new_matrix = this.state.matrix;
        if (event.target.value == ""){
            new_matrix[key[0]][key[1]] = ""
        } else if (event.target.value == "-"){
            new_matrix[key[0]][key[1]] = -1;
        } else {
            new_matrix[key[0]][key[1]] = parseFloat(event.target.value);
        }
        this.setState({
            matrix:new_matrix
        })
    }

    async capture(video, canvas, width=video.videoWidth, height=video.videoHeight) { 
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(video, 0, 0, (height*(video.videoWidth/video.videoHeight)), height);  
    }
    
    async convolution(){
        var video = document.getElementById('user_video');
        const canvas = document.getElementById('canvas');    
        const kernel = {name: "blur", kernel: this.state.matrix};
        this.capture(video, canvas).then(function(){
            canvas.toBlob(async function(blob) {
                var newImg = document.createElement('img');
                var url = URL.createObjectURL(blob);
                newImg.src = url;
                const jimp_photo = await Jimp.read(newImg.src);
                jimp_photo.convolute(kernel.kernel)
                const imageData = new ImageData(
                    Uint8ClampedArray.from(jimp_photo.bitmap.data),
                    jimp_photo.bitmap.width,
                    jimp_photo.bitmap.height
                );
                canvas.getContext('2d').putImageData(imageData, 0, 0);
            });
    
        });
    }
    
    modelLoaded(){
        console.log('Model Loaded!');
        this.setState({
            isModelLoaded:true
        })

    }

    async catify(){
        const self = this;
        if (self.state.isModelLoaded){
            var video = document.getElementById('user_video');
            const canvas = document.getElementById('canvas');   
            self.capture(video, canvas, 256, 256).then(function(){
            canvas.toBlob(async function(blob) {
                var newImg = document.createElement('img');
                var url = URL.createObjectURL(blob);
                newImg.src = url;
                const jimp_photo = await Jimp.read(newImg.src);
                const imageData = new ImageData(
                    Uint8ClampedArray.from(jimp_photo.bitmap.data),
                    jimp_photo.bitmap.width,
                    jimp_photo.bitmap.height
                );
                canvas.getContext('2d').putImageData(imageData, 0, 0);
                self.pix2pix.transfer(canvas, (err, result) => {
                        $("#react_wrapper_1").append(result)
                    });
            })
        }) 
    }};


    render() {
      return(<div className="fr ac">
        <div className="fc ac">
                Main Matrix
                {this.state.matrix.map((row, row_n) => {
                    return <div className="fr" key={row_n}>
                        {row.map((cell_value,column_n) => {
                            const item_index = `${row_n},${column_n}`;
                            return <div className="fc" key={row_n,column_n}>
                                <textarea className="matrix_cell" value={Math.round(cell_value*100)/100} name={item_index} onChange={this.handleChange} />
                                </div>
                            })}
                        </div> })}
            </div>
            <div className="fc ac">
                <h2> Dabbling in Images </h2>
                <video id="user_video" autoPlay />
                <button onClick={this.convolution}>Convolute</button>
                <button onClick={this.catify}>Catify</button>
                <button onClick={loadAudio}>LoadAudio</button>
                <canvas id="canvas"></canvas>
            </div>
        </div>
        );
    }
  }

$(document).ready(function(){
    ReactDOM.render(<VideoInput />, document.getElementById("react_wrapper_1"))
    const withAudio = true;
    loadCamera("#user_video",withAudio);    
});

