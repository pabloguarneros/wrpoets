const takeImageGesture = new GestureDescription('take_picture');

for(let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  takeImageGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}