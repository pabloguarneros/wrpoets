import $ from "jquery";
import React from "react";
import {Room} from "./room_class.js"

class UserGallery extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rooms: [], 
        };

        this.handleFetchUserGallery = this.handleFetchUserGallery.bind(this);
            
    };

    componentDidMount(){ this.handleFetchUserGallery() };

    handleFetchUserGallery(){
        const gallery_api = "/nubes/rooms";
        fetch(gallery_api)
            .then((response) => response.json())
            .then((data) => {
                let rooms = [];
                for (let room in data){
                    const room_object = new Room(data[room]['pk'],data[room]['title'],data[room]['description']);
                    rooms.push(room_object);
                };
                this.setState({
                    rooms: rooms
                })
            }).then( () => {
                $('#room_gallery_wrapper').removeClass("destroy")} );  

    }

    render() {

        return(<div id="room_gallery" className="fr">
                    {this.state.rooms.map((room, index) => {
                        return <div className="room_item" key={index}>
                            <button onClick={room.openRoom}></button>
                        </div>
                    })}
            </div>
            )
    }

};

export {UserGallery};