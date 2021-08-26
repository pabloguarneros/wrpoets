
let video;

function load_image_capture(){
  video = document.querySelector("#camera_content");
  if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
          main();
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });
    }

};

async function main() {

  const knownGestures = [
    loadCameraGesture,
    takeImageGesture
  ];

  const GE = new GestureEstimator(knownGestures);
  // load handpose model
  const model = await handpose.load();
  var timer = 0;
  var picture_taken = true;

  // main estimation loop
  const estimateHands = async () => {

      // Therefore the maximum number of predictions is 1
      const predictions = await model.estimateHands(video, true);
      timer += 1;


      for(let i = 0; i < predictions.length; i++) {

      
        // now estimate gestures based on landmarks
        // using a minimum confidence of 9.0 (out of 10)
        const est = GE.estimate(predictions[i].landmarks, 9.0);

        if(est.gestures.length > 0) {

          // find gesture with highest confidence
          let result = est.gestures.reduce((p, c) => { 
            return (p.confidence > c.confidence) ? p : c;
          });
          if (result.name == "load_camera"){
            timer = 0;
            picture_taken = false;
          } else if (result.name == "take_picture" & timer < 5 & !picture_taken){
            takePicture(video);
            picture_taken = true;
            
          }
        }
      }

      // ...and so on
      setTimeout(() => { estimateHands(); }, 1000 / video.fps);
    };

    estimateHands();

  }


