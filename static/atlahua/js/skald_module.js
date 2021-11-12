import React from "react";
import $ from 'jquery';

class SkaldModule extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        story: '',
        choices: [],
        preloaded_queries: {}
      };
      this.handleChange = this.handleChange.bind(this);
      this.getCompletionLibrary = this.getCompletionLibrary.bind(this);
      this.loadDatabase = this.loadDatabase.bind(this);
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
                "seen_text":headline,
                "hidden_query":headline
            })
        }
        this.setState({
            choices: choices
        }, () => {
            this.loadDatabase();;
        })

    }

    loadDatabase(){
        let preload_copy = this.state.preloaded_queries;
        const this_obj = this;
        const query_list = []
        this.state.choices.forEach((choice)=>{
            query_list.push(choice["hidden_query"])
        })
        const queries = query_list.join("||")

        const api = `/nubes/huggingface/preload?q=${queries}`;
        fetch(api)
            .then(response => response.json())
            .then(function(data){
                Object.entries(data).forEach(([key, value]) => {
                    console.log(data);
                    preload_copy[key] = value;
                });
                this_obj.setState({
                    preloaded_queries: preload_copy
            })
        })
    }

    pushChoices(data, query, innerHTML){

        const this_obj = this;
        const choices = [];
    
        for (var c = 0; c < data.choices.length; c++){
            choices.push({
                "seen_text":data.choices[c].choice,
                "hidden_query":data.choices[c].hidden_query
            })}

        const story = (query == innerHTML)
            ? this_obj.state.story.concat(data.completed_sentence)
            : this_obj.state.story.concat(innerHTML).concat(data.completed_sentence);
            
        this.setState({
            story: story,
            choices: choices
        }, () => {
            this.loadDatabase();;
        })
    }
  
    getCompletionLibrary(event) {

        event.preventDefault();
        const query = event.target.value;
        const innerHTML = event.target.innerHTML;

        if (this.state.preloaded_queries[`${query}`]){
            this.pushChoices(this.state.preloaded_queries[`${query}`],
                        query, innerHTML);
        } else{
            const api = `/nubes/huggingface/1?q=${query}`;
            fetch(api)
                .then(response => response.json())
                .then(function(data){
                    this.pushChoices(data, query, innerHTML);
                })
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
      }
    
  
    render() {
      return (
        <div className="fc ac card_title">
            <h2> Let's Tell A Story </h2>
            <p> {this.state.story} </p>
            {this.state.choices.map( (choice, index) => (
                <button value={choice["hidden_query"]} key={index} onClick={this.getCompletionLibrary}>
                    {choice["seen_text"]}
                </button>
            ))}
        </div>
      );
    }
  }

export { SkaldModule }