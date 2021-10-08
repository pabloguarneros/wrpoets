function getMatrixL(renderElement){
    var matrixL;
    var A = math.matrix([
        [renderElement.state.matrixA[0][0], renderElement.state.matrixA[0][1], renderElement.state.matrixA[0][2]],
        [renderElement.state.matrixA[1][0], renderElement.state.matrixA[1][1], renderElement.state.matrixA[1][2]],
        [renderElement.state.matrixA[2][0], renderElement.state.matrixA[2][1], renderElement.state.matrixA[2][2]]
    ]);
    var first_step = math.matrix([
            [1,0,0],
            [-(renderElement.state.matrixA[1][0]/renderElement.state.matrixA[0][0]),1,0],
            [-(renderElement.state.matrixA[2][0]/renderElement.state.matrixA[0][0]),0,1]
        ]);
    var first_L = math.multiply(first_step, A)._data;
    if (first_L[1][1] != 0) {
        var second_step = math.matrix([
            [1,0,0],
            [0,1,0],
            [0,-(first_L[2][1]/first_L[1][1]),1]
        ]);
        matrixL = math.multiply(second_step,first_L)._data;
    } else if (first_L[2][2] != 0) {
        var shift_zero = math.matrix([
            [1,0,0],
            [0,0,1],
            [0,1,0]
        ]);
        var in_between_zero = math.multiply(shift_zero,first_L)._data;
        var second_step = math.matrix([
            [1,0,0],
            [0,1,0],
            [0,-(in_between_zero[2][1]/in_between_zero[1][1]),1]
        ]);
        matrixL = math.multiply(second_step,in_between_zero)._data;
    } else {
        matrixL = first_L;
    } 
    return(matrixL)
};

function getMatrixU(renderElement){
    var matrixU;
    var A = math.matrix([
        [renderElement.state.matrixA[0][0], renderElement.state.matrixA[0][1], renderElement.state.matrixA[0][2]],
        [renderElement.state.matrixA[1][0], renderElement.state.matrixA[1][1], renderElement.state.matrixA[1][2]],
        [renderElement.state.matrixA[2][0], renderElement.state.matrixA[2][1], renderElement.state.matrixA[2][2]]
    ]);
    if (renderElement.state.matrixA[2][2] != 0) {
        var first_operation = math.matrix([
            [1,0,-(renderElement.state.matrixA[0][2]/(renderElement.state.matrixA[2][2]))],
            [0,1,-(renderElement.state.matrixA[1][2]/(renderElement.state.matrixA[2][2]))],
            [0,0,1]
        ]);
        var first_U = math.multiply(first_operation,A)._data;
    } else {
        var first_operation = math.matrix([
            [0,0,1],
            [0,1,0],
            [1,0,0]
        ]);
        var in_between_matrix = math.multiply(first_operation,A)._data;
        var second_operation = math.matrix([
            [1,0,-(in_between_matrix[0][2]/(in_between_matrix[2][2]))],
            [0,1,-(in_between_matrix[1][2]/(in_between_matrix[2][2]))],
            [0,0,1]] );
        var first_U = math.multiply(second_operation,in_between_matrix)._data;
    }
    if (first_U[1][1] != 0) {
        var second_step = math.matrix([
            [1,-(first_U[0][1]/first_U[1][1]),0],
            [0,1,0],
            [0,0,1]
        ]);
        matrixU = math.multiply(second_step,first_U)._data;
    } else {
        matrixU =first_U;
    }
    return(matrixU)
};

export {getMatrixL, getMatrixU}