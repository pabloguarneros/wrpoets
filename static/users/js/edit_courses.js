function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

class EditCourses extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scene: 1,
            courses: [], 
            lesson_pk:'',
            lesson_title:'',
            lesson_description:'',
            lesson_privacy:false,
            loaded_nodes:[],
            node_pk:'',
            node_title:'',
            node_description:'',
            node_x:'',
            node_y:'',
            node_z:'',
            node_squishy:'',
            node_images:'',
            new_lesson_title:'',
            new_lesson_description:'...',
            images_to_upload: [],

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFetchCourses = this.handleFetchCourses.bind(this);
        this.handleCreateCourse = this.handleCreateCourse.bind(this);
        this.handleFetchCourseDetail = this.handleFetchCourseDetail.bind(this);
        this.handleCreateNode = this.handleCreateNode.bind(this);
        this.handleLetNode = this.handleLetNode.bind(this);
        this.handlePrivacyCourse = this.handlePrivacyCourse.bind(this);
        this.handleSubmitSaveCourse = this.handleSubmitSaveCourse.bind(this);
        this.handleSubmitSaveNode = this.handleSubmitSaveNode.bind(this);
        this.handleSubmitSavePreviewNode = this.handleSubmitSavePreviewNode.bind(this);
        this.handleSubmitDeleteNode = this.handleSubmitDeleteNode.bind(this);
        this.goNodeBack = this.goNodeBack.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
    };

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
      } 

    componentDidMount(){
        this.handleFetchCourses();    
    };

    handleFetchCourses(){
        const courses = "/nubes/courses";
        fetch(courses)
            .then((response) => response.json())
            .then ((data) => 
                this.setState(({
                    courses: data,
                    scene:1
                }))
            ).then(()=>{$('#edit_courses').css("opacity","1")}
            );  
    }

    handleFetchCourseDetail(event,nodeID=false){
        if (event==3 | event==2){
            var lesson = `/nubes/courses/${this.state.lesson_pk}`
            var nodes = `/nubes/nodes/${this.state.lesson_pk}`
            var scene = event
        }else{
            event.preventDefault();
            var lesson = `/nubes/courses/${event.target.name}`
            var nodes = `/nubes/nodes/${event.target.name}`
            var scene = 2;
        }
        const obj = this;
        fetch(lesson)
            .then((response) => response.json())
            .then (function(lessonData){ 
                fetch(nodes)
                    .then((response) => response.json())
                    .then (function(nodeData){ 
                        obj.setState(({
                            loaded_nodes: nodeData,
                            scene:scene,
                            lesson_pk: lessonData["pk"],
                            lesson_title: lessonData["title"],
                            lesson_description: lessonData["description"],
                            lesson_privacy: lessonData["public"],
                        }),
                        function(){
                            if (nodeID){
                                this.handleLetNode(nodeID);
                            }
                        }
                        
                        );
                    }
                    ); 
    })
    }

    handleLetNode(event){
        if (typeof event === 'object') {
            event.preventDefault();
            var pk = event.target.name;
        }else{
            var pk = event;
        };
        let node;
        for (var i in this.state.loaded_nodes){
            const loaded=this.state.loaded_nodes[i]
            if (loaded["pk"] == pk){
                node = loaded;
            }
        }
        this.setState(({
            node_pk: node["pk"],
            node_title: node["title"],
            node_description: node["description"],
            node_x: node["x_position"],
            node_y: node["y_position"],
            node_z: node["z_position"],
            node_squishy: node["squishy"],
            node_images: node["images"],
            scene: 3
        }))        
    }

    handleCreateCourse(event) {
        event.preventDefault();
        const obj = this;
        const url = window.location.origin.concat(`/nubes/courses`);
        fetch(url, {
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
            },
            body:JSON.stringify({
                "title": this.state.new_lesson_title,
                "description": this.state.new_lesson_description,
                "public": false
            })
        }).then(function(response){
            return response.json();
        }).then(function(data){
            obj.setState(state => ({
                scene:2,
                new_lesson_title:'',
                new_lesson_description:'',
                lesson_title:obj.state.new_lesson_title,
                lesson_description:obj.state.new_lesson_description,
                lesson_pk:data["pk"]
            }));
        }
        )};
    

    handleSubmitSaveCourse(event) {
        event.preventDefault();
        const lessonID = this.state.lesson_pk;
        const url = window.location.origin.concat(`/nubes/courses/${lessonID}`);
        if (this.state.lesson_description != ""){
            var lesson_description = this.state.lesson_description;
        }else{
            var lesson_description = "...";
        };
        fetch(url, {
            method:'PUT',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
            },
            body:JSON.stringify({
                "title": this.state.lesson_title,
                "description": lesson_description,
                "public": this.state.privacy
            })
        }).then(function(){
            var d = new Date();
            var hour = d.getHours();
            var min = d.getMinutes();
            $("#output_message").html(`Saved @ ${hour}:${min}`);
        })
        
      }
    
      handlePrivacyCourse(event) {
        event.preventDefault();
        if(event.target.value==1){
            var lesson_privacy = true;
        }else{
            var lesson_privacy = false;
        }
        const lessonID = this.state.lesson_pk;
        const obj = this;
        const url = window.location.origin.concat(`/nubes/courses/${lessonID}`);
        if (this.state.lesson_description != ""){
            var lesson_description = this.state.lesson_description;
        }else{
            var lesson_description = "...";
        }
        fetch(url, {
            method:'PUT',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
            },
            body:JSON.stringify({
                "title": this.state.lesson_title,
                "description": lesson_description,
                "public": lesson_privacy
            })
        }).then(function(){
            obj.setState(({
                lesson_privacy:lesson_privacy
            }));
        })
        }

    handleCreateNode(event) {
        event.preventDefault();
        const lessonID = this.state.lesson_pk;
        const obj = this;
        const url = window.location.origin.concat(`/nubes/nodes/${lessonID}`);
        fetch(url, {
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
            },
            body:JSON.stringify({
                "title": "My New Poem",
                "squishy":0.2,
                "description":"...",
                "x_position":0,
                "y_position":0.5,
                "z_position":-1
            })
        }).then(function(response){
            return response.json();
        }).then(function(data){
            obj.handleFetchCourseDetail(3,data["pk"]);
            return data["pk"];
        });
    };
    
    handleSubmitSaveNode(event) {
        event.preventDefault();
        const obj = this;
        const lessonID = this.state.lesson_pk;
        const nodeID = this.state.node_pk;
        const url = window.location.origin.concat(`/nubes/nodes/${lessonID}/${nodeID}`);
        if (this.state.node_description != ""){
            var node_description = this.state.node_description;
        }else{
            var node_description = "...";
        };
        fetch(url, {
            method:'PATCH',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
            },
            body:JSON.stringify({
                "title": this.state.node_title,
                "squishy": this.state.node_squishy,
                "description": node_description,
                "x_position": this.state.node_x,
                "y_position": this.state.node_y,
                "z_position": this.state.node_z
            })
        }).then(function(){
            var d = new Date();
            var hour = d.getHours();
            var min = d.getMinutes();
            $("#output_message").html(`Saved @ ${hour}:${min}`);
            obj.handleFetchCourseDetail(3);
        })

    };

    handleSubmitSavePreviewNode(event) {
        this.handleSubmitSaveNode(event);
        const lessonID = this.state.lesson_pk;
        window.open(`${window.location.origin}/experiments/t/${lessonID}`);
        }

    handleSubmitDeleteNode(event) {
        event.preventDefault();
        const obj = this;
        const lessonID = this.state.lesson_pk;
        const nodeID = this.state.node_pk;
        const url = window.location.origin.concat(`/nubes/nodes/${lessonID}/${nodeID}`);
        fetch(url, {
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':getCookie('csrftoken'),
            },
        }).then(function(){
            obj.handleFetchCourseDetail(2);
        })
    }

    render() {
        if (this.state.scene == 1){
            return this.renderCourses();
        }
        else if (this.state.scene == 2){
            return this.renderLesson();
        }
        else if (this.state.scene == 3){
            return this.renderNode();
        }
    };
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
                    {this.state.courses.map((value) => {
                        return <div>
                            <button className="course_item" name={value["pk"]} onClick={this.handleFetchCourseDetail}>{value["title"]}</button>
                        </div>
                    })}
                    <div>
                        <button className="course_add" onClick={openCreate}>add new poetry collection</button>
                    </div>
                </div>
                <div id="new_course_bubble" style={{display:"none"}}>
                    <p className="create_course_heading"> New Poetry Collection</p> 
                    <label>
                        <small> Title </small> 
                        <textarea value={this.state.new_lesson_title} name="new_lesson_title" onChange={this.handleChange} />
                    </label>
                    <label>
                        <small> Description </small> 
                        <textarea value={this.state.new_lesson_description} name="new_lesson_description" onChange={this.handleChange} />
                    </label>

                    <div className="controls">
                        <button className="save_buttons" onClick={closeCreate}>cancel</button>
                        <button className="save_buttons" onClick={this.handleCreateCourse}>start writing</button>
                    </div>
                </div>
            </div>)
    }

    goNodeBack(){
        this.setState({
            scene:this.state.scene-1,
        });
    }
     renderLesson(){
    
        return(<div id="edit_course_react">
                <div id="render_lesson" style={{filter:"blur(0px)"}} className="fr">
                    <div className="page_div" style={{height:"90%"}}></div>
                    <div className="fc" style={{height:"90%"}}>
                        <div className="fr" style={{height:"90%"}}>
                        <div id="lesson_meta">
                            <label>
                                <small class="helper_course_name"> Collection Name </small> 
                                <textarea value={this.state.lesson_title} name="lesson_title" onChange={this.handleChange} />
                            </label>
                            <label>
                                <small class="helper_course_description"> Collection Description </small> 
                                <textarea value={this.state.lesson_description} name="lesson_description" onChange={this.handleChange} />
                            </label>
                        </div>
                        <div id="nodes_gallery">
                            <div>
                                <button className="node_add" name={this.state.lesson_pk} onClick={this.handleCreateNode}>new poem</button>
                            </div>
                            {this.state.loaded_nodes.map((value,index) => {
                                return <div>
                                    <button className="node_item" name={value["pk"]} onClick={this.handleLetNode}>{value["title"]}</button>
                                </div>
                                })}
                            </div>
                        </div>
                        <div className="bottom_nav fr">
                            <button className="save_buttons" onClick={this.handleFetchCourses}>˂</button>
                            <button className="save_buttons" onClick={this.handleSubmitSaveCourse}>SAVE</button>
                            {this.state.lesson_privacy ?
                                <button className="save_buttons" value={0} onClick={this.handlePrivacyCourse}>UNPUBLISH</button>
                                : <button className="save_buttons" value={1} onClick={this.handlePrivacyCourse}>PUBLISH</button>
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
        const lessonID = this.state.lesson_pk;
        const nodeID = this.state.node_pk;
        const formData = new FormData(); 
        const image_count = this.state.images_to_upload.length;
        for (var i = 0; i < image_count; i++){
            formData.append( 
                `${i}`, 
                this.state.images_to_upload[i], 
                this.state.images_to_upload[i].name 
              ); 
        };
        const url = window.location.origin.concat(`/nubes/nodes/${lessonID}/${nodeID}`);
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
            obj.handleFetchCourseDetail(3,obj.state.node_pk);

        })
    }

    renderNode(){        
        return(<div id="edit_course_react">
                <div id="render_node" className="fr">
                <div className="page_div" style={{height:"90%"}}></div>
                    <div id="node_content_wrap" className="fc">
                        <div id="node_content" className="fr">
                            <div id="node_meta">
                                <label>
                                    <small class="helper_node_name"> Title </small> 
                                    <textarea value={this.state.node_title} name="node_title" onChange={this.handleChange} />
                                </label>
                                <label>
                                    <small class="helper_node_description"> Poem </small> 
                                    <textarea id="poem_content" value={this.state.node_description} name="node_description" onChange={this.handleChange} />
                                </label>
                            </div>
                            <div id="node_visual_edit" className="fc" >

                                <div style={{width:"80%",height:"30%"}}>{this.state.node_images.length > 0
                                        ? <div id="image_map">
                                            {this.state.node_images.map((x) =>
                                            <img src={x["image"]}/>
                                            )}
                                            </div>
                                        :
                                        <div id="upload_map">
                                                <input type="file" onChange={this.onFileChange} multiple /> 
                                                <button className="save_buttons" onClick={this.onFileUpload}> 
                                                Upload! 
                                                </button> 
                                                <div id="upload_message_error"></div>
                                        </div> //end upload map
                                    } </div> {/* end width:80%*/}

                            <div id="node_position">
                                <p>Align Poem</p>
                                <label className="fr">
                                    <small> Layer gap: </small> 
                                    <textarea value={this.state.node_squishy} name="node_squishy" onChange={this.handleChange} />
                                </label>
                                <label className="fr">
                                    <small> X: </small> 
                                    <textarea value={this.state.node_x} name="node_x" onChange={this.handleChange} />
                                </label>
                                <label className="fr">
                                    <small> Z: </small> 
                                    <textarea value={this.state.node_z} name="node_z" onChange={this.handleChange} />
                                </label>
                                <label className="fr">
                                    <small> Y: </small> 
                                    <textarea value={this.state.node_y} name="node_y" onChange={this.handleChange} />
                                </label>
                            </div> {/* end node_position */}
                            
                        </div>  {/* end node visual edit */}
                    </div> {/* end fr */}

                    <div className="bottom_nav">
                        <button className="save_buttons" onClick={this.goNodeBack}>˂</button>
                        <button className="save_buttons" onClick={this.handleSubmitSaveNode}>SAVE</button>
                        <button className="save_buttons" onClick={this.handleSubmitSavePreviewNode}>PREVIEW</button>
                        <button className="save_buttons" onClick={this.handleSubmitDeleteNode}>DELETE</button>
                        <div id="output_message"></div>
                    </div>

                </div>{/* end node content*/}
                    <div className="page_div" style={{height:"90%"}}></div>
                </div>
            </div>)
    }
};

$(document).ready(function(){
    ReactDOM.render(<EditCourses />, document.querySelector("#edit_courses"));
});
