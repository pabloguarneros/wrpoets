import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import $ from 'jquery';

function buildID() {
    var ID = "";
    var choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
        ID += choices.charAt(Math.floor(Math.random() * choices.length));
    return ID;
  }

function makeWS(){
    const protocol = (window.location.protocol == 'https:') ? 'wss://' : 'ws://';
    const chatSocket = new WebSocket(
        protocol + window.location.host + '/ws/chat'
    );
    
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const newID = buildID();
        const newDiv = document.createElement("div");
        newDiv.setAttribute('class','cardContainer');
        document.getElementById("fakeBody").appendChild(newDiv);
        const renderin = (data.type == "question") ?
            <Card  divID={newID} ws={chatSocket}
            askable={data.question}
            options={data.options} />
            :
            <Match  divID={newID} ws={chatSocket}
            match={data.match} />
        ReactDOM.render(renderin, newDiv); 
    };
    
    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
    
    return chatSocket;
}

$(document).ready(function(){

    makeWS();   

});

    
class Card extends React.Component {

    constructor(props) {
        super(props);
        this.ws = props.ws;
        this.state = {
            hasChosen: 0,
            binaryChoice: this.props.options.length==2
        }
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragSubmit = this.handleDragSubmit.bind(this);
        this.handleClickSubmit = this.handleClickSubmit.bind(this);
    };

    handleDrag(){
        if(this.state.hasChosen == 0){
            const cardX = $("#".concat(this.props.divID)).css('transform').split(',')[4];
            const cardRelativeWidth = 0.9;
            const cardRelativeX = cardX/window.screen.width*cardRelativeWidth;
            $("#".concat(this.props.divID)).css('opacity',(1-Math.abs(cardRelativeX)));
            const optionChosen = (cardRelativeX > 0) ? "yes" : "no";
            $("#optionChosen").html(`option chosen: ${optionChosen}`);
            if (Math.abs(cardRelativeX) > 0.35){
                this.handleDragSubmit(optionChosen);
                if (cardRelativeX > 0) {
                    this.setState({ hasChosen: 1 });
                } else {
                    this.setState({ hasChosen: -1 });
                }
            }
        }
        
    };
    
    handleDragSubmit(output){
        this.ws.send(JSON.stringify({
            'message': output
        }));
    };

    handleClickSubmit(e){
        $(e.target).css("background","white");
        $(e.target).css("color","#61045F");
        $("#optionChosen").html(`option chosen: ${e.target.value}`);
        setTimeout(()=>{
            this.ws.send(JSON.stringify({
                'message': e.target.value
            }));
            this.setState({ hasChosen: 1 });
        },600)
        
    };
    
    render() {

        var draggableClass = "card"; 
        switch(this.state.hasChosen){
            case 0:
                draggableClass = "card appear"
                break
            case 1:
                draggableClass = "card disappearR"
                break
            case -1:
                draggableClass = "card disappearL"
                break
        }

        return (
        <Draggable
            axis="x"
            onDrag={this.handleDrag}
            disabled={(this.state.hasChosen != 0)||(!this.state.binaryChoice)}
         >
            <div id={this.props.divID}
                className={draggableClass}>
                <div className="askable">
                    {this.props.askable}
                </div>
                { (!this.state.binaryChoice) &&
                    <div className="multi_choice">
                        {this.props.options.map((option,key) =>
                        (<div key={key}>
                            <button value={option} onClick={this.handleClickSubmit}>
                                {option}
                            </button>
                         </div>))}
                    </div>
                }
            </div>
        </Draggable>
  );}
}

class Match extends React.Component {

    constructor(props) {
        super(props);
        this.ws = props.ws;
    };
    
    render() {
        return (
        <div>
            <div id={this.props.divID} className="card match">
                <div className="match_label">You have a match!</div>
                <div className="askable">
                    {this.props.match}
                </div>
            </div>
        </div>
  );}
}
