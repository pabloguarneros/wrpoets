function buildCubicBezierCurve(initialPoints){
    const pointArray = [];
    const p1 = initialPoints[0];
    const p2 = initialPoints[1];
    const p3 = initialPoints[2];
    const p4 = initialPoints[3];
    for (let t = 0; t <= 1; t += 0.01){ // iterates 100 times
        pointArray.push(
            p1 * ( (-(t**3)) + (3*(t**2)) - (3*t) + 1 ) +
            p2 * ( (3*(t**3)) - (6*(t**2)) + (3*t) ) +
            p3 * ( (-3*(t**2)) + (3*(t**2)) ) +
            p4 * (t**3)
        )
    }
    return pointArray
}


export { buildCubicBezierCurve }