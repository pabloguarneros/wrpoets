import Poem from './poem_class.js';

class Collection{

    constructor(pk, title, description, privacy) {
        
        this.pk = pk;
        this.title = title;
        this.description = description;
        this.privacy = privacy;
        this.poems = [];
        this.active_poem_pk = 0;

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handlePrivacy = this.handlePrivacy.bind(this);
        this.fetchPoems = this.fetchPoems.bind(this);
        this.createPoem = this.createPoem.bind(this);
        this.changeActivePoem = this.changeActivePoem.bind(this);
        this.getPoem = this.getPoem.bind(this);

    } // end constructor()

    handleChange(event) {
        const name = event.target.name;
        this[name] = event.target.value;
        component.forceUpdate();
    } // end handleChange() 

    handleSave() {
        const url = window.location.origin.concat(`/nubes/courses/${this.pk}`);
        fetch(url, { method:'PATCH', headers: defaultHeaders,
            body:JSON.stringify({
                "title": (this.title) ? this.title : "-",
                "description": (this.description) ? this.description : "-",
                "public": this.privacy
            })
        }).then( ()=> {
            let d = new Date();
            $("#output_message").html(`Saved @ ${d.getHours()}:${d.getMinutes()}`);
            component.forceUpdate();
        })
        
    } // end handleSave() 
    
    handlePrivacy(event) {
        event.preventDefault();
        this.privacy = (event.target.value == "0") ? false : true;
        const url = window.location.origin.concat(`/nubes/courses/${this.pk}`);
        fetch(url, {
            method:'PATCH',
            headers: defaultHeaders,
            body:JSON.stringify({ "public": this.privacy })
        }).then( () => { component.forceUpdate() }) // end fetch
    } // handlePrivacy

    async fetchPoems(){
        let nodes = `/nubes/nodes/${this.pk}`;
        return await fetch(nodes)
            .then((response) => response.json())
            .then((data) => { 
                let poems = [];
                for (let i in data) {
                    const poem = new Poem(this, data[i]['pk'], data[i]['title'],
                                        {'x': data[i]['x_position'], 'y': data[i]['y_position'], 'z':data[i]['z_position']},
                                        data[i]['images']);
                    poems.push(poem);
                };
                this.poems = poems;
            }) // end fetch(nodes)
    } // end fetchPoems()
    
    createPoem() {
        
        const url = window.location.origin.concat(`/nubes/nodes/${this.pk}`);
        fetch(url, { method:'POST', headers: defaultHeaders,
            body:JSON.stringify({
                "title": "New Item",
                "x_position":0,
                "y_position":0.5,
                "z_position":-1
            })})
            .then( () => { this.fetchPoems()
                .then( () => { component.forceUpdate() } )
            })
        } // end createPoem

    changeActivePoem(index){
        this.active_poem_pk = index;
    }

    getPoem(index = this.active_poem_pk){
        return this.poems[index]
    }

    
}; // end Collection

export default Collection;