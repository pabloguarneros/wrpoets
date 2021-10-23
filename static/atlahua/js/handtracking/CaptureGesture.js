import $ from "jquery";
import { knownGestures } from "./Gestures.js";
import { GestureEstimator } from "./GestureEstimator.js";
import { moveBallUp, expandBall, shrinkBall, moveBall} from "./userActions.js";

var position_storage = [[0,0,0],0]

function subtractPositions(current_p){
  const weight = Math.min(50,position_storage[1]);
  const last_p = position_storage[0];
  const x_diff = (last_p[0]*weight + current_p[0])/(weight+1);
  const y_diff = (last_p[1]*weight + current_p[1])/(weight+1);
  const z_diff = (last_p[2]*weight + current_p[2])/(weight+1);
  const new_p = [x_diff, y_diff, z_diff]
  position_storage = [new_p, weight + 1]
  return position_storage[0]
}

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
          if (result.name == "move_up"){
            moveBallUp(three_canvas);
          } else if (result.name == "shrink"){
            shrinkBall(three_canvas);            
          } else if (result.name == "expand"){
            expandBall(three_canvas);   
          } else if (result.name == "move"){
            const current_p = predictions[i].landmarks[8];
            console.log(current_p);
            const position_difference = subtractPositions(current_p);
            console.log(position_difference);
            moveBall(three_canvas, position_difference);
          }
        }
      }
      // ...and so on
      setTimeout(() => { estimateHands(); }, 1000 / video.fps);
    };

    estimateHands();

  }

export {loadGestures};
