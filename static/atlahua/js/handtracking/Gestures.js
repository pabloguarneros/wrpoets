import { GestureDescription } from "./GestureDescription.js";
import {Finger, FingerCurl, FingerDirection} from "./FingerDescription.js";

//https://blog.tensorflow.org/2019/11/handtrackjs-tracking-hand-interactions.html

const moveGesture = new GestureDescription('move');
moveGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
for(let finger of [Finger.Thumb, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  moveGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

const shrinkGesture = new GestureDescription('shrink');
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  shrinkGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}

const expandGesture = new GestureDescription('expand');
for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  expandGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

const knownGestures = [moveGesture, shrinkGesture, expandGesture];

export {knownGestures}