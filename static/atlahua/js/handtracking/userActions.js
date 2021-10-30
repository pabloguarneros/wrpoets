
function expandBall(three_canvas){
    three_canvas.controls.update(0,-1);
}

function shrinkBall(three_canvas){
    three_canvas.controls.update(0,1); 
}


export { expandBall, shrinkBall};