import React from "react";
import $ from 'jquery';
import {handleResearchPaperInput} from "./connect_conversion.js"

class LoadAbstract extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: 'Insert Here'
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      event.preventDefault();
      let speech = new SpeechSynthesisUtterance();
        function load_parameters(speaker,language,rate,volume,pitch){
          speaker.lang = language;
          speaker.rate = rate;
          speaker.volume = volume;
          speaker.pitch = pitch;
        }
      load_parameters(speech,"en",0.8,5.0,1.0)
      handleResearchPaperInput(this.state.value).then(value => {
        $("#render_song").html(`${value}`);
        $("#paper_upload_wrapper").addClass("left_display");
        $("#program_output_wrapper").addClass("showcase");
        speech.text = value.split("</br>");
        window.speechSynthesis.speak(speech);
      });

    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit} id="abstract_input" className="fc ac">
        <div className="fc ac card_title">
            <h2>The Paper </h2>
            <small>Copy & Paste The Abstract </small>
        </div>
          <label className="fc ac">
            <textarea value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="SONGIFY" />
        </form>
      );
    }
  }

export { LoadAbstract }