class Brush{

    constructor(){
        this.width = 0.1;
        this.paintColor = 0xffff00;
    };

}

class AR_Edit{

    constructor(){
        this.can_paint = true;
        this.is_painting = false;
        this.brush = new Brush()
        this.is_repositioning = false;
        this.can_reposition_objects = false;
        this.dragged_object;
        this.intersects = [];
    };

}

export default AR_Edit;