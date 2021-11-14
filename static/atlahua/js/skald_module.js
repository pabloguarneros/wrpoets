import React from "react";
import $ from 'jquery';

class SkaldModule extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        story: '...',
        choices: [],
      };
      this.getCompletionLibrary = this.getCompletionLibrary.bind(this);
      this.pushChoices = this.pushChoices.bind(this);
    }

    componentDidMount(){
        this.loadInitialPhrases();
    }

    get_news(headline){
        return headline.excerpt.rendered.slice(3,250).split(' ').slice(0,5).join(' ')
    }

    async loadInitialPhrases(){
        const endpoint = `https://techcrunch.com/wp-json/wp/v2/posts?per_page=3&context=embed`;
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        const json = await response.json();
        let choices = [];

        for (var v=0; v<json.length; v++){
            const headline = this.get_news(json[v]);
            choices.push({
                "sentence":headline,
                "hidden_query":headline
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
            ? data["sentence"]
            : this_obj.state.story.concat(innerHTML).concat(` ${data["sentence"]}`);
            
        this.setState({
            story: story,
            choices: choices
        });

    }
  
    getCompletionLibrary(event) {

        // Fetch Completion Library for a Given Query

        const this_obj = this;
        event.preventDefault();

        const query = event.target.value;
        const innerHTML = event.target.innerHTML;
        
        const api = `/nubes/huggingface/${query}`;

        fetch(api) 
            .then(response => response.json())
            .then(function(data){
                // after the data gets fetched, choose a random element from the data
                this_obj.pushChoices(
                    data[Math.floor(Math.random()*data.length)],
                    query, innerHTML);
            })
    }

    render() {
      return (
        <div id="skald_react_frame">
            <div id="story_input">
                <p id="choice_instructions"> You Choose.&nbsp;A.I. Completes </p>
                <div id="user_choices">
                {this.state.choices.map( (choice, index) => (
                    <button className="choice_option" value={choice["hidden_query"]} key={index}
                            onClick={this.getCompletionLibrary}>
                        {choice["sentence"]}
                    </button> ))}
                </div>
            </div>
            <div id="story_meta_options">
                <button id="cancel_story">CANCEL</button>
                <button id="save_story">SAVE STORY</button>
            </div>
            <div id="story_output">
                <p id="story_title"> my untitled story #1 </p>
                <p id="story_body"> {this.state.story} </p>
            </div>
        </div>
      );
    }
  }

export { SkaldModule }