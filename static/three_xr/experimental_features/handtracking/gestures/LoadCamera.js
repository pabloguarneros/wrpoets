const loadCameraGesture = new GestureDescription('load_camera');

// thumb:
// - not curled
// - vertical up (best) or diagonal up left / right
loadCameraGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);

loadCameraGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
loadCameraGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);



// all other fingers:
// - curled
// - horizontal left or right
for(let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
  loadCameraGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
}