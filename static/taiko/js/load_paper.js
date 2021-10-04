import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

import { LoadAbstract } from './load_abstract.js';

class PaperUpload extends React.Component {
    render() {
      return(<div id="paper_upload" className="fc ac">
            <LoadAbstract />
        </div>
        );
    }
  }

  class ProgramOutput extends React.Component {
    render() {
      return(<div id="program_output" className="fc ac">
          <div className="fc ac card_title">
            <h2>The Poem </h2>
            <small> Copy & Paste The Abstract </small>
            </div>
            <div id="render_song"></div>
        </div>
        );
    }
  }

$(document).ready(function(){
    ReactDOM.render(<PaperUpload />, document.getElementById("paper_upload_wrapper"));    
    ReactDOM.render(<ProgramOutput />, document.getElementById("program_output_wrapper"));    
});
