import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import {getMatrixL,getMatrixU} from './calculateMatrices.js';

var matrix_render;

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
  }

class Matrix extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            matrixA:[[1,1,1],[1,1,1],[1,1,1]],
        };
        this.handleChange = this.handleChange.bind(this);
        this.makeDefaultMatrix = this.makeDefaultMatrix.bind(this);

    };

    handleChange(event){
        const key = event.target.name.split(',');
        const new_matrix = this.state.matrixA;
        if (event.target.value == ""){
            new_matrix[key[0]][key[1]] = ""
        } else if (event.target.value == "-"){
            new_matrix[key[0]][key[1]] = -1;
        } else {
            new_matrix[key[0]][key[1]] = parseFloat(event.target.value);
        }
        this.setState({
            matrixA:new_matrix
        })
    }

    makeDefaultMatrix(event){
        const matrix = JSON.parse(event.target.value);
        this.setState({
            matrixA:matrix
        })
    }

    render() {
        var matrixL_div;
        var matrixU_div;
        var triangle_matrices = {"L": [getMatrixL(this), matrixL_div],
                                "U": [getMatrixU(this), matrixU_div]};
        for (let key in triangle_matrices){
            triangle_matrices[key][1] = <div className="fc ac"> Matrix {key}
            {triangle_matrices[key][0].map((row, row_n) => {
                return(
                <div className="fr" key={row_n}>
                    {row.map((cell,column_n) => {
                        var color = "#f00000";
                        if (cell == 0){
                            color = "#f98c8c";
                        }
                        return <div style={{backgroundColor:color}} className="fc matrix_cell" key={row_n,column_n}>
                            <div>{Math.round(cell*100)/100}</div>
                        </div> })}
                    </div> )})}
                </div>
            };
            
      return(
        <ErrorBoundary>
        <div id="dive_wrapper" className="fr">
            <div id="main_matrix" className="fc ac">
                <div className="fc ac">
                    Main Matrix
                    {this.state.matrixA.map((row, row_n) => {
                        return <div className="fr" key={row_n}>
                            {row.map((cell_value,column_n) => {
                                const item_index = `${row_n},${column_n}`;
                                return <div className="fc" key={row_n,column_n}>
                                    <textarea className="matrix_cell" value={Math.round(cell_value*100)/100} name={item_index} onChange={this.handleChange} />
                                    </div>
                                })}
                            </div> })}
                </div>
                <div id="l_u_matrix" className="fr">
                    {Object.entries(triangle_matrices).map(([key,value]) =>{
                        return <div key={key}> {value[1]} </div> })}
                </div>
            </div>
            <div id="get_default_matrices" className="fc">
                <button value="[[1,-3,1],[2,-1,1],[6,-1,0]]" onClick={this.makeDefaultMatrix}>A</button>
                <button value="[[1,3,1],[-3,1,1],[0,1,-1]]" onClick={this.makeDefaultMatrix}>B</button>
                <button value="[[-3,0,-2],[2,-2,4],[3,-3,-5]]" onClick={this.makeDefaultMatrix}>C</button>
                <button value="[[1,-1,2],[3,4,-5],[-3,-2,3]]" onClick={this.makeDefaultMatrix}>R</button>
                <button value="[[1,6,2],[2,12,5],[-1,-3,-1]]" onClick={this.makeDefaultMatrix}>S</button>
            </div>
        </div>
        </ErrorBoundary>
        )
    }
}

$(document).ready(function(){
    matrix_render = <Matrix />;
    ReactDOM.render(matrix_render, document.getElementById("matrix_input"));    
});
