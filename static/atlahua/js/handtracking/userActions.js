function moveBallUp(three_canvas){
    const pos = three_canvas.sphere.position;
    three_canvas.sphere.position.set(pos.x,pos.y+0.7,pos.z);
    console.log("ball is going up");
}

function moveBall(three_canvas, position_difference){
    const pos = three_canvas.sphere.position;
    three_canvas.sphere.position.set(pos.x+position_difference[0]*0.001,
                                    pos.y+position_difference[1]*0.001,
                                    pos.z+position_difference[2]*0.001);
}

function expandBall(three_canvas){
    const pos = three_canvas.sphere.position;
    three_canvas.sphere.position.set(pos.x,pos.y,pos.z+0.1);
}

function shrinkBall(three_canvas){
    const pos = three_canvas.sphere.position;
    three_canvas.sphere.position.set(pos.x,pos.y,pos.z-0.1);
}


export { moveBallUp, expandBall, shrinkBall, moveBall};