class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '', 
            blurb:'',
            patreon: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSaveUser = this.handleSaveUser.bind(this);
    };

    
    componentDidMount(){
        const user = "/people/info/api/single";
        const obj=this;
        fetch(user)
            .then((response) => response.json())
            .then ((data) => 
                obj.setState(({
                    username: data[0]['username'], 
                    blurb:data[0]['blurb'],
                    patreon: data[0]['patreon']
                }))
            ).then(function(){
                $('#edit_profile').css("opacity","1")
            }
            );        
    };

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
      } 

      handleSaveUser(event) {
        event.preventDefault();
        const username = this.state.username;
        const blurb = this.state.blurb;
        const patreon = this.state.patreon;
        $.ajaxSetup({ 
            beforeSend: function(xhr, settings) {
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
                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                    // Only send the token to relative URLs i.e. locally.
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            } 
        });
        $.ajax( 
        { 
            url: `/people/save/manager/user`,
            type:"POST", 
            data:{ 
                username: username,
                blurb: blurb,
                patreon: patreon
                }, 
        
        success: function() {
            var d = new Date();
            var hour = d.getHours();
            var min = d.getMinutes();
            $("#user_save_message").html(`saved @ ${hour}:${min}`);
        }
    });
      }

    render() {
        return(
            <div id="edit_profile_react">
                <label style={{marginBottom:"20px"}}>
                    <small style={{fontSize:"15px"}}> @{this.state.username} </small> 
                </label>
                <label>
                    <small> Edit Profile Blurb </small> 
                    <textarea value={this.state.blurb} name="blurb" onChange={this.handleChange} />
                </label>
                <div id="user_socials">
                <label>
                    <small> Edit Patreon URL </small> 
                    <textarea value={this.state.patreon} name="patreon" onChange={this.handleChange} />
                </label>
                    <div className="user_save" class="fc">
                        <button className="save_buttons h_cent" onClick={this.handleSaveUser}>save</button>
                        <div id="user_save_message" style={{fontSize:"13px",margin:"10px"}}></div>
                    </div>
                </div>
            </div>)
    };
}

$(document).ready(function(){
    ReactDOM.render(<EditProfile />, document.querySelector("#edit_profile"));
});
