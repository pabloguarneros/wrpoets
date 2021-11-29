import $ from "jquery";
import { knownGestures } from "../handtracking/Gestures.js";
import { GestureEstimator } from "../handtracking/GestureEstimator.js";
import { expandBall, shrinkBall} from "../handtracking/userActions.js";
import { Stroke } from "./drawing_tools.js";

async function loadGestures(video, three_canvas) {

  const GE = new GestureEstimator(knownGestures);
  const model = await handpose.load(); // loads model in cdnjs

  const estimateHands = async () => {
      const predictions = await model.estimateHands(video, true);

      for(let i = 0; i < predictions.length; i++) {

        // now estimate gestures based on landmarks
        // using a minimum confidence of 9.0 (out of 10)
        const est = GE.estimate(predictions[i].landmarks, 9.0);

        if(est.gestures.length > 0) {
          // find gesture with highest confidence
          let result = est.gestures.reduce((p, c) => { 
            return (p.confidence > c.confidence) ? p : c;
          });
          if (result.name == "shrink"){
            shrinkBall(three_canvas);            
          } else if (result.name == "expand"){
            expandBall(three_canvas);   
          } else if (result.name == "move"){
            if (predictions[0]){
              const stroke = new Stroke(three_canvas);
              const indexFingerTipPosition = predictions[0].landmarks[8];
              stroke.generateStroke(indexFingerTipPosition);
            }
          }
        }
      }
      // ...and so on
      setTimeout(() => { estimateHands(); }, 1000 / video.fps);
    };

    estimateHands();

  }

export {loadGestures};
