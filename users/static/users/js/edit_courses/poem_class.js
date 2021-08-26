class Poem {

    constructor(collection, pk, title, description, position, gap, images) {

        this.collection = collection;
        this.pk = pk;
        this.title = title;
        this.description = description;
        this.position = position;
        this.gap = gap;
        this.images = images

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

    } // end constructor

    handleChange(event) {

        switch (event.target.name) {
            case "x":
                this.position.x = event.target.value;
                break;
            case "y":
                this.position.y = event.target.value;
                break;
            case "z":
                this.position.z = event.target.value;
                break;
            default:
                this[event.target.name] = event.target.value;

        }
        component.forceUpdate();
    } // end handleChange()

    handleSave(event) {
        event.preventDefault();
        const poem_obj = this;
        const url = window.location.origin.concat(`/nubes/nodes/${poem_obj.collection.pk}/${poem_obj.pk}`);
        fetch(url, { method:'PUT', headers: defaultHeaders,
            body:JSON.stringify({
                "title": poem_obj.title,
                "squishy": poem_obj.gap,
                "description": poem_obj.description,
                "x_position": poem_obj.position.x,
                "y_position": poem_obj.position.y,
                "z_position": poem_obj.position.z,
            })
        }).then(function(){
            let d = new Date();
            $("#output_message").html(`Saved @ ${d.getHours()}:${d.getMinutes()}`);
            poem_obj.collection.fetchPoems();
        })
    };

    handleDelete() {
        const poem_obj = this;
        const url = window.location.origin.concat(`/nubes/nodes/${poem_obj.collection.pk}/${poem_obj.pk}`);
        fetch(url, { method:'DELETE', headers: defaultHeaders })
            .then(() => { poem_obj.collection.fetchPoems()
                .then( () => { 
                    component.setState({ scene: 2 });
                    })
            })
    } // end handleDelete
} // end Poem
