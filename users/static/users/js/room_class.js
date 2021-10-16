import $ from "jquery";
import {Augmented_Environment} from "../../../../static/three_xr/on_load/build_environment.js";

class Room{

    constructor(pk, title, description) {
        
        this.pk = pk;
        this.title = title;
        this.description = description;

        this.openRoom = this.openRoom.bind(this);

    } 

    openRoom(){
        const environment = new Augmented_Environment("images", "explore", this.pk);
        environment.build("#room_ar_wrapper");
        //console.log(environment);
        $("#bottom_navigator_room").addClass("reveal");
        $("#profile_card").addClass("slide_up");
        $("#room_gallery_wrapper").addClass("destroy");
    }

    
}; // end Collection

export {Room};