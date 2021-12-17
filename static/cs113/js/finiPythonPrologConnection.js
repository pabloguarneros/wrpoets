import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import $ from 'jquery';

function logMessage(message, sender){
    const textDiv = document.createElement("p");
    switch (sender) {
        case "user":
            textDiv.setAttribute("class","userMessage");
            break
        case "prolog":
            textDiv.setAttribute("class","prologMessage");
            break
    }
    textDiv.innerHTML=message;
    const chatDiv = document.getElementById("chatLog");
    chatDiv.appendChild(textDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;

}

function makeWSConnection(){

    const protocol = (window.location.protocol == 'https:') ? 'wss://' : 'ws://';
    const chatSocket = new WebSocket( protocol + window.location.host + '/ws/fini');
    
    chatSocket.onmessage = function(e) {
        const prologMessage = JSON.parse(e.data)["prolog_message"];
        logMessage(prologMessage, "prolog");
        if (JSON.parse(e.data)["is_alert"]){
            chatSocket.send(JSON.stringify({
                'message': "noted"
            }));
        }
    };
    
    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
    
    return chatSocket;
}
    
class UserInput extends React.Component {

    constructor(props) {
        super(props);
        this.ws = props.ws;
        this.state = {
            userInput: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendToProlog = this.sendToProlog.bind(this);
    };

    handleChange(event) {
        this.setState({userInput: event.target.value});
      }
    
    sendToProlog(event){
        event.preventDefault();
        const userInput = this.state.userInput;
        this.ws.send(JSON.stringify({
            'message': userInput
        }));
        this.setState({userInput:""}
            ,logMessage(userInput, "user"));
    };

    render() {

        return (
            <form onSubmit={this.sendToProlog}>
            <label>
              <input type="text" value={this.state.userInput} onChange={this.handleChange} />
            </label>
            <input type="submit" value="send" />
          </form>
  );}
}


$(document).ready(function(){
    const ws = makeWSConnection();   
    ReactDOM.render(< UserInput ws={ws} /> , $("#userInput")[0]); 
});
