function getCookie(name) {

    let cookieValue = null;
    if (document.cookie && document.cookie != '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const defaultHeaders = {
    'Content-type':'application/json',
    'X-CSRFToken':getCookie('csrftoken'),
};

let component;

$(document).ready(function(){
    component = ReactDOM.render(<EditCourses />, document.querySelector("#edit_courses"));
});

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

        fetch(url, { method:'PATCH', headers: defaultHeaders,
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
            .then(() => { poem_obj.collection.fetchPoems() })
            .then(() => { 
                component.setState({ scene:2 });
                component.forceUpdate(); })
    } // end handleDelete
} // end Poem

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
                    const poem = new Poem(this, data[i]['pk'], data[i]['title'], data[i]['description'],
                                        {'x': data[i]['x_position'], 'y': data[i]['y_position'], 'z':data[i]['z_position']},
                                        data[i]['squishy'], data[i]['images']);
                    poems.push(poem);
                };
                this.poems = poems;
            }) // end fetch(nodes)
    } // end fetchPoems()
    
    async createPoem() {
        
        const url = window.location.origin.concat(`/nubes/nodes/${this.pk}`);
        return await fetch(url, { method:'POST', headers: defaultHeaders,
            body:JSON.stringify({
                "title": "My New Poem",
                "squishy":0.2,
                "description":"...",
                "x_position":0,
                "y_position":0.5,
                "z_position":-1
            })})
            .then(function(response){ return response.json() }) // end fetch
            .then( (createResponse) => {
                this.fetchPoems()
                    .then( (poems) => {
                        let index = 0;
                        for (let i in poems){
                            if (poems[i].pk == createResponse["pk"]){ index = i };
                        };
                        this.changeActivePoem(index)
                }  // end fetchPoems()
                )}) // end createPoem()
        } // end createPoem

    changeActivePoem(index){
        this.active_poem_pk = index;
    }

    getPoem(index = this.active_poem_pk){
        return this.poems[index]
    }

    
}; // end Collection

class EditCourses extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scene: 1,

            collections: [], // list of Collection objects
            active_collection: null, 

            new_collection_title:'',
            new_collection_description:'...',
            images_to_upload: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.goBack = this.goBack.bind(this);

        this.handleFetchCourses = this.handleFetchCourses.bind(this);
        this.handleCreateCourse = this.handleCreateCourse.bind(this); 
        this.handleCreatePoem = this.handleCreatePoem.bind(this);
        
        this.handleToggleCollection = this.handleToggleCollection.bind(this); 
        this.handleTogglePoem = this.handleTogglePoem.bind(this); 

        this.onFileChange = this.onFileChange.bind(this); 
        this.onFileUpload = this.onFileUpload.bind(this);
    
    };

    componentDidMount(){ this.handleFetchCourses() };

    handleFetchCourses(){
        const courses = "/nubes/courses";
        fetch(courses)
            .then((response) => response.json())
            .then((data) => {
                let collections = [];
                for (let i in data){
                    const collection = new Collection(data[i]['pk'],data[i]['title'],data[i]['description'],data[i]['public']);
                    collections.push(collection);
                };
                this.setState({
                    scene:1,
                    collections: collections
                })
            }).then( () => {$('#edit_courses').css("opacity","1")} );  

    } // end handleFetchCourses

    render() {
        switch (this.state.scene){
            case 1: return this.renderCourses()
            case 2: return this.renderLesson()
            case 3: return this.renderNode()
        }
    };

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({ [name]: target.value });
    } // handleChange 

    handleCreateCourse(event) {
        event.preventDefault();
        const obj = this;
        const url = window.location.origin.concat(`/nubes/courses`);
        const new_title = this.state.new_collection_title;
        const new_description = this.state.new_collection_description;
        fetch(url, {
            method:'POST',
            headers: defaultHeaders,
            body:JSON.stringify({
                "title": new_title,
                "description": new_description,
                "public": false
            })})
            .then(function(response){ return response.json() })
            .then((data)=>{
                const collection = new Collection(data['pk'], new_title, new_description, false);
                let collections = this.state.collections;
                collections.push(collection);
                obj.setState({
                    scene:2,
                    new_collection_title:'',
                    new_collection_description:'',
                    collections: collections,
                    active_collection: collection
                });
            }) //end fetch

    }; // end handleCreateCourse()

    renderCourses(){

         function openCreate(){
            $("#new_course_bubble").css("display","flex");
         };
         function closeCreate(){
            $("#new_course_bubble").css("display","none");
            $("#course_list").css("filter","blur(0px)");
         };

        return(<div id="edit_course_react">
                <div id="course_list" className="h_cent">
                    {this.state.collections.map((collection, index) => {
                        return <div>
                            <button className="course_item" name={index} onClick={this.handleToggleCollection}>{collection.title}</button>
                        </div>
                    })}
                    <div>
                        <button className="course_add" onClick={openCreate}> add new poetry collection </button>
                    </div>
                </div>
                <div id="new_course_bubble" style={{display:"none"}}>
                    <p className="create_course_heading"> New Poetry Collection</p> 
                    <label>
                        <small> Title </small> 
                        <textarea value={this.state.new_collection_title} name="new_collection_title" onChange={this.handleChange} />
                    </label>
                    <label>
                        <small> Description </small> 
                        <textarea value={this.state.new_collection_description} name="new_collection_description" onChange={this.handleChange} />
                    </label>

                    <div className="controls">
                        <button className="save_buttons" onClick={closeCreate}>cancel</button>
                        <button className="save_buttons" onClick={this.handleCreateCourse}>start writing</button>
                    </div>
                </div>
            </div>)
    }

    handleToggleCollection(e){
        e.preventDefault();
        const collection = this.state.collections[e.target.name];
        collection.fetchPoems().then( () => {
            this.setState({
                active_collection: collection,
                scene: 2,
            })
        })
    } // end handleToggleCollection()

    handleCreatePoem(e){
        e.preventDefault();
        this.state.active_collection.createPoem()
            .then(() => { this.setState ({ scene: 3 })
        })  // end createPoem
    } // end handleCreatePoem()

    handleTogglePoem(e){
        e.preventDefault();
        this.state.active_collection.changeActivePoem(e.target.name);
        this.setState({ scene: 3 })
    } // end handleTogglePoem()

    goBack(){
        this.setState({
            scene:this.state.scene-1,
        });
    }

    renderLesson(){

        const collection = this.state.active_collection;

        function openPreview(){
            window.open(`${window.location.origin}/experiments/t/${collection.pk}`)
        };

        return(<div id="edit_course_react">
                <div id="render_lesson" style={{filter:"blur(0px)"}} className="fr">
                    <div className="page_div" style={{height:"90%"}}></div>
                    <div className="fc" style={{height:"90%"}}>
                        <div className="fr" style={{height:"90%"}}>
                        <div id="lesson_meta">
                            <label>
                                <small class="helper_course_name"> Collection Name </small> 
                                <textarea value={collection.title} name="title" onChange={collection.handleChange} />
                            </label>
                            <label>
                                <small class="helper_course_description"> Collection Description </small> 
                                <textarea value={collection.description} name="description" onChange={collection.handleChange} />
                            </label>
                        </div>
                        <div id="nodes_gallery">
                            <div>
                                <button className="node_add" name={collection.pk} onClick={collection.createPoem}>new poem</button>
                            </div>
                            {collection.poems.map((poem,index) => {
                                return <div>
                                    <button className="node_item" name={index} onClick={this.handleTogglePoem}>{poem.title}</button>
                                </div>
                                })}
                            </div>
                        </div>
                        <div className="bottom_nav fr">
                            <button className="save_buttons" onClick={this.handleFetchCourses}>˂</button>
                            <button className="save_buttons" onClick={collection.handleSave}>SAVE</button>
                            <button className="save_buttons" onClick={openPreview}>PREVIEW</button>
                            {collection.privacy ?
                                <button className="save_buttons" value={0} onClick={collection.handlePrivacy}>UNPUBLISH</button>
                                : <button className="save_buttons" value={1} onClick={collection.handlePrivacy}>PUBLISH</button>
                            }
                            <div id="output_message"></div>
                        </div>
                    </div>
                    <div className="page_div" style={{height:"90%"}}></div>
                </div> 
            </div>)
    }

    onFileChange(event){ 
            this.setState({ images_to_upload: event.target.files }); 
    }; 
    
    // On file upload (click the upload button) 
    onFileUpload(event){ 
        event.preventDefault();
        const obj = this;
        const collection = obj.state.active_collection;
        const poemID = collection.getPoem().pk;
        const formData = new FormData(); 
        const image_count = obj.state.images_to_upload.length;
        for (let i = 0; i < image_count; i++){
            formData.append( 
                `${i}`, 
                obj.state.images_to_upload[i], 
                obj.state.images_to_upload[i].name 
              ); 
        };
        const url = window.location.origin.concat(`/nubes/nodes/${collection.pk}/${poemID}`);
        fetch(url, {
            method:'POST',
            mode: 'same-origin',  
            headers:{
                'Accept': 'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest', 
            },
            body:formData
        }).then(function(){
            collection.fetchPoems().then(()=>{obj.forceUpdate()});
        })
    }

    renderNode(){   
        const poem = this.state.active_collection.getPoem();     
        return(<div id="edit_course_react">
                <div id="render_node" className="fr">
                <div className="page_div" style={{height:"90%"}}></div>
                    <div id="node_content_wrap" className="fc">
                        <div id="node_content" className="fr">
                            <div id="node_meta">
                                <label>
                                    <small class="helper_node_name"> Title </small> 
                                    <textarea value={poem.title} name="title" onChange={poem.handleChange} />
                                </label>
                                <label>
                                    <small class="helper_node_description"> Poem </small> 
                                    <textarea id="poem_content" value={poem.description} name="description" onChange={poem.handleChange} />
                                </label>
                            </div>
                            <div id="node_visual_edit" className="fc" >

                                <div style={{width:"80%",height:"30%"}}>
                                    {poem.images.length > 0
                                        ?
                                        <div id="image_map">
                                            {poem.images.map((x) => <img src={x["image"]}/> )}
                                        </div>
                                        :
                                        <div id="upload_map">
                                                <input type="file" onChange={this.onFileChange} multiple /> 
                                                <button className="save_buttons" onClick={this.onFileUpload}> 
                                                Upload! 
                                                </button> 
                                                <div id="upload_message_error"></div>
                                        </div> 
                                    }
                                </div> {/* end width:80%*/}

                            <div id="node_position">
                                <p>Align Poem</p>
                                <label className="fr">
                                    <small> Layer gap: </small> 
                                    <textarea value={poem.gap} name="gap" onChange={poem.handleChange} />
                                </label>
                                <label className="fr">
                                    <small> X: </small> 
                                    <textarea value={poem.position.x} name="x" onChange={poem.handleChange} />
                                </label>
                                <label className="fr">
                                    <small> Z: </small> 
                                    <textarea value={poem.position.z} name="z" onChange={poem.handleChange} />
                                </label>
                                <label className="fr">
                                    <small> Y: </small> 
                                    <textarea value={poem.position.y} name="y" onChange={poem.handleChange} />
                                </label>
                            </div> {/* end node_position */}
                            
                        </div>  {/* end node visual edit */}
                    </div> {/* end fr */}

                    <div className="bottom_nav">
                        <button className="save_buttons" onClick={this.goBack}>˂</button>
                        <button className="save_buttons" onClick={poem.handleSave}>SAVE</button>
                        <button className="save_buttons" onClick={poem.handleDelete}>DELETE</button>
                        <div id="output_message"></div>
                    </div>

                </div>{/* end node content*/}
                    <div className="page_div" style={{height:"90%"}}></div>
                </div>
            </div>)
    }
};