import React from "react";
import $ from 'jquery';

class StoryCompletion extends React.Component {
    constructor(props, starting_phrases) {
      super(props);
      this.state = {
        story: '',
        choices: [],
      };
      this.fetchCompletionLibrary = this.fetchCompletionLibrary.bind(this);
      this.pushChoices = this.pushChoices.bind(this);
      this.appendSentence = this.appendSentence.bind(this);
      this.finishStory = this.finishStory.bind(this);
    }

    componentDidMount(){
        this.loadInitialPhrases(this.props.phrases);
    }

    async loadInitialPhrases(starting_phrases){
        
        let choices = [];
        for (var s=0; s<starting_phrases.length; s++){
            choices.push({
                "sentence":starting_phrases[s],
                "hidden_query":starting_phrases[s]
            })
        }

        this.setState({
            choices: choices
        });
    }

    pushChoices(data, query, innerHTML){

        const this_obj = this;
        const choices = [];
    
        for (var c = 0; c < data["choices"].length; c++){
            choices.push({
                "sentence":data.choices[c]["sentence"],
                "hidden_query":data.choices[c]["hidden_query"]
            })}

        const story = (query == innerHTML)
            ? data["sentence"] + " "
            : innerHTML + " " + data["sentence"] + " ";
            
        this.setState((state)=>{
            return {
                choices: choices,
                story: state.story + story }
        }, this.appendSentence(story));

    }

    appendSentence(sentence){
        var ele = '<span>' + sentence.split('').join('</span><span>') + '</span>';
        $(ele).hide().appendTo(`#${this.props.this_ID} .story_body`).each(function (i) {
            $(this).delay(50 * i).css({
                display: 'inline',
                opacity: 0
            }).animate({
                opacity: 1
            }, 100);
        });
    }

    finishStory(query){
        $(`#${this.props.this_ID} .story_input`).remove();
        $(`#${this.props.this_ID} .story_output`).addClass("story_finished");
        $(`#${this.props.this_ID} .story_end`).addClass("story_finished");
        this.appendSentence(query +" ...");
    }

  
    fetchCompletionLibrary(event) {

        const this_obj = this;
        event.preventDefault();

        const query = event.target.value;
        const innerHTML = event.target.innerHTML;
        
        const api = `/nubes/huggingface/${query}`;

        fetch(api) 
            .then(response => response.json())
            .then(function(data){
                if (data.length > 0){
                    this_obj.pushChoices(
                        data[Math.floor(Math.random()*data.length)],
                        query, innerHTML);
                } else { this_obj.finishStory(innerHTML+" "+query); }
                
            })
    }

    render() {
      return (
        <div className="skald_react_frame">
            <div className="story_input">
                <p className="choice_instructions"> You Choose.&nbsp;A.I. Completes </p>
                <div className="user_choices">
                {this.state.choices.map( (choice, index) => (
                    <button className="choice_option" value={choice["hidden_query"]} key={index}
                            onClick={this.fetchCompletionLibrary}>
                        {choice["sentence"]}
                    </button> ))}
                </div>
            </div>
            <div className="story_meta_options">
            </div>
            <div className="story_output">
                <h5 className="story_title"> {this.props.story_title} </h5>
                <div className="story_body">
                    
                </div>
                <p className="story_end">
                    Yey! {String.fromCodePoint(0x1F680)} You reached the end. <br/>
                    Keep pressing those arrows keys ← ↑ → to move on. <br/>
                </p>
            </div>
        </div>
      );
    }
  }

export { StoryCompletion }