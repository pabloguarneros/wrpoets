import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

class MatrixInput extends React.Component {

    render() {
      return(<div id="paper_upload" className="fc ac">
            fasdf
        </div>
        );
    }
  }

$(document).ready(function(){
    ReactDOM.render(<MatrixInput />, document.getElementById("matrix_input"));    
});
