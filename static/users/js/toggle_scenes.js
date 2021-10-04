import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import {UserGallery} from "./load_gallery.js"
import {CameraView} from "./load_camera.js"

$(function(){
    $("#go_back_button").on('click',function(){
        $("#bottom_navigator_room").removeClass("reveal");
        $("#profile_card").removeClass("slide_up");
        $("#room_gallery_wrapper").removeClass("destroy");
    })
});

$(document).ready(function(){
    ReactDOM.render(<SceneManager />, document.querySelector("#room_gallery_wrapper"));
});

class SceneManager extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scene: 1
        };

        this.handleNavigation = this.handleNavigation.bind(this);
            
    };

    handleNavigation(){
        const sceneManager = this
        $("#camera_button").on('click',function(){
            sceneManager.setState({scene: 0});
        })
        $("#home_button").on('click',function(){
            sceneManager.setState({scene: 1});
        })
    }

    componentDidMount(){
        this.handleNavigation() 
    };



    render() {

        switch(this.state.scene){
            case 0:
                return <CameraView />
            case 1:
                return <UserGallery />
        }

    }

};