import React from "react";
import $ from "jquery";
import ReactDOM from "react-dom";
import Collection from './collection_class.js';

let component;

$(document).ready(function(){
    component = ReactDOM.render(<EditCourses />, document.querySelector("#edit_courses"));
});

class EditCourses extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scene: null,

            collections: [], 
            active_collection: null, 

            new_collection_title:'',
            new_collection_description:'...',
            images_to_upload: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.goBack = this.goBack.bind(this);

        this.handleFetchCourses = this.handleFetchCourses.bind(this);
        this.handleCreateCourse = this.handleCreateCourse.bind(this); 
        
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
            }).then( () => {
                $('#edit_courses').css("opacity","1")} );  

    } // end handleFetchCourses

    render() {
        switch (this.state.scene){
            case 1: return this.renderCollections()
            case 2: return this.renderCollectionDetail()
            case 3: return this.renderPoemDetail()
            default: return this.renderEmpty()

        }
    };

    renderEmpty(){
        return(<div></div>)
    }

    renderCollections(){

         function openCreate(){
            $("#new_course_bubble").css("display","flex");
         };
         function closeCreate(){
            $("#new_course_bubble").css("display","none");
            $("#course_list").css("filter","blur(0px)");
         };
         $("#edit_courses").css("background","#FFFFFF26");

        return(<div id="list_collections_react" className="revealCollectionList">
                <div id="course_list" className="h_cent">
                    {this.state.collections.map((collection, index) => {
                        return <div key={collection.pk.toString()}>
                            <button className="course_item" name={index} onClick={this.handleToggleCollection}>{collection.title}</button>
                        </div>
                    })}
                    <div>
                        <button className="course_add" onClick={openCreate}> create room </button>
                    </div>
                </div>
                <div id="new_course_bubble" style={{display:"none"}}>
                    <p className="create_course_heading"> Create Your AR Room </p> 
                    <label>
                        <small> Room Name </small> 
                        <textarea value={this.state.new_collection_title} name="new_collection_title" onChange={this.handleChange} />
                    </label>
                    <label>
                        <small> Room Description </small> 
                        <textarea value={this.state.new_collection_description} name="new_collection_description" onChange={this.handleChange} />
                    </label>

                    <div className="controls">
                        <button className="save_buttons" onClick={closeCreate}>cancel</button>
                        <button className="save_buttons" onClick={this.handleCreateCourse}>start creating</button>
                    </div>
                </div>
            </div>)
    }

    renderCollectionDetail(){

        const collection = this.state.active_collection;
        var is_mobile = (/Mobi|Android/i.test(navigator.userAgent)) ? true : false;
        function openPreview(){
            if (is_mobile) {
                window.location.href=`${window.location.origin}/room/${collection.pk}`;
            } else {
                window.open(`${window.location.origin}/room/${collection.pk}`)
            }
        };
        function openEditAR(){
                window.location.href=`${window.location.origin}/room/edit/${collection.pk}`;
        }

        return(<div id="edit_collection_react" className="revealCollectionDetail">
                <div id="render_lesson" style={{filter:"blur(0px)"}} className="fc">
                        <div id="collection_detail_body" className="fr">
                        <div id="lesson_meta">
                            <label>
                                <small className="helper_course_name"> Room Name </small> 
                                <textarea value={collection.title} name="title" onChange={collection.handleChange} />
                            </label>
                            <label>
                                <small className="helper_course_description"> Room Description </small> 
                                <textarea value={collection.description} name="description" onChange={collection.handleChange} />
                            </label>
                        </div>
                        <div id="nodes_gallery">
                            <div>
                                <button className="node_add" name={collection.pk} onClick={collection.createPoem}>add item</button>
                            </div>
                            {collection.poems.map((poem,index) => {
                                return <div key={poem.pk.toString()} >
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
                            {is_mobile &&
                                <button className="save_buttons" onClick={openEditAR}>EDIT IN AR</button>
                            }
                            <div id="output_message"></div>
                        </div>
                </div> 
            </div>)
    }

    renderPoemDetail(){   
        const poem = this.state.active_collection.getPoem();     
        return(<div id="edit_poem_react" >
                <div id="render_node" className="fc expandPoem">
                        <div id="node_content" className="fr">
                        
                            <div id="node_visual_edit" className="fc" >

                                <div id="maps_container">
                                    {poem.images.length > 0
                                        ?
                                        <div id="image_map">
                                            {poem.images.map((x,i) => <img key={i} src={x["image"]}/> )}
                                        </div>
                                        :
                                        <div id="upload_map">
                                                <input type="file" onChange={this.onFileChange} multiple /> 
                                                <button className="save_buttons" onClick={this.onFileUpload}> 
                                                Upload images.
                                                </button> 
                                                <div id="upload_message_error"></div>
                                        </div> 
                                    }
                                </div> {/* end width:80%*/}

                            <div id="node_position">
                                <p>Align Poem</p>
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

                            <div id="node_meta">
                                <label className="node_heading">
                                    <small className="helper_node_name"> Heading </small> 
                                    <textarea value={poem.title} name="title" onChange={poem.handleChange} />
                                </label>
                            </div>
                            
                    </div> {/* end fr */}

                    <div className="bottom_nav">
                        <button className="save_buttons" onClick={this.goBack}>˂</button>
                        <button className="save_buttons" onClick={poem.handleSave}>SAVE</button>
                        
                        <button className="save_buttons" onClick={poem.handleDelete}>DELETE</button>
                        <div id="output_message"></div>
                    </div>

                </div>{/* end node content*/}
            </div>)
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({ [name]: target.value });
    } // handleChange 

    handleCreateCourse(event) {
        event.preventDefault();
        const obj = this;
        const url = window.location.origin.concat(`/nubes/courses`);
        const new_title = this.state.new_collection_title ? this.state.new_collection_title : "-";
        const new_description = this.state.new_collection_description ? this.state.new_collection_description : "-";
        fetch(url, { method:'POST', headers: defaultHeaders,
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


    handleToggleCollection(e){
        e.preventDefault();
        const collection = this.state.collections[e.target.name];
        collection.fetchPoems().then( () => {
            this.setState({
                active_collection: collection,
                scene: 2,
            });
        })
    } // end handleToggleCollection()

    handleTogglePoem(e){
        e.preventDefault();
        this.state.active_collection.changeActivePoem(e.target.name);
        this.setState({ scene: 3 })

    } // end handleTogglePoem()

    goBack(e){
        e.preventDefault();
        this.setState({
            scene:this.state.scene-1,
        });

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
        $("#upload_map button").html("uploading...");
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

};