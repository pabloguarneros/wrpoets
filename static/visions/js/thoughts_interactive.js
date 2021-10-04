class Welcome extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scene: "START",
            poems: [], 
            questions: [], 
            ideas: [], 
            blogs: [], 
            thoughts: [], 
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        //this.handleFetchWriting = this.handleFetchWriting.bind(this);
        //this.handleFetchProjects = this.handleFetchProjects.bind(this);
        //this.handleFetchIdeas = this.handleFetchIdeas.bind(this);
    
    };

    render() {
        if (this.state.scene == "START"){
            return this.renderType();
        }
        else if (this.state.scene == "POEM"){
            return this.renderWriting();
        }
        else if (this.state.scene == "BLOG"){
            return this.renderBlog();
        }
        else if (this.state.scene == "IDEAS"){
            return this.renderIdeas();
        }
    }

    renderExplore(){
        const toggles = { 
            "#projects_key":false,
            "#ideas_key":false,
            "#writing_key":false
        }
        $("#projects_key")[0].addEventListener('markerFound', () => {
            toggles["#projects_key"] = true;
        });
        $("#projects_key")[0].addEventListener('markerLost', () => {
            toggles["#projects_key"] = false;
        })
        $("#ideas_key")[0].addEventListener('markerFound', () => {
            toggles["#ideas_key"] = true;
        });
        $("#ideas_key")[0].addEventListener('markerLost', () => {
            toggles["#ideas_key"] = false;
        })
        $("#writing_key")[0].addEventListener('markerFound', () => {
            toggles["#writing_key"] = true;
        });
        $("#writing_key")[0].addEventListener('markerLost', () => {
            toggles["#writing_key"] = false;
        })
       
        $(document).on('click', function(){
            
            if (toggles["#projects_key"]){
            $("#marker_check").html(`
            <a-scene embedded height="100%">
                <a-entity id="rain" particle-system="preset: dust; color: #FFFFFF; particleCount: 5000"></a-entity>

                    <a-entity position="0 0 -20" rotation="0 0 0">
                        <a-torus color="#56cfe1" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                        <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                        <a-text color="#000" value="Storyture.com" align="center" width="15" height="15" position="0 2 0"></a-text>
                        <a-text color="#000" value="a social movie database" align="center" width="10" height="10" position="0 0 0"></a-text>
                        <a-text  color="#000"value="founder and full-stack developer" align="center" width="10" height="10" position="0 -1 0"></a-text>
                    </a-entity>
                    <a-entity position="0 0 20" rotation="0 -180 0">
                        <a-torus color="#ffd639" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                        <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                        <a-text color="#000" value="NLP_otter" align="center" width="15" height="15" position="0 2 0"></a-text>
                        <a-text color="#000" value="Natural Language Processing Repo" align="center" width="10" height="10" position="0 0 0"></a-text>
                        <a-text  color="#000"value="Writer and Researcher" align="center" width="10" height="10" position="0 -1 0"></a-text>
                    </a-entity>
                    <a-entity position="20 0 0" rotation="0 -90 0">
                        <a-torus color="#bfd200" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                        <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                        <a-text color="#000" value="GreenBook" align="center" width="15" height="15" position="0 2 0"></a-text>
                        <a-text color="#000" value="A.I. Powered Community For Plant-Lovers" align="center" width="10" height="10" position="0 0 0"></a-text>
                        <a-text  color="#000"value="Software Engineer - Mobile" align="center" width="10" height="10" position="0 -1 0"></a-text>
                    </a-entity>
                    <a-entity position="-20 0 0" rotation="0 90 0">
                        <a-torus color="#7678ed" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                        <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                        <a-text color="#000" value="Superman" align="center" width="15" height="15" position="0 2 0"></a-text>
                        <a-text color="#000" value="Suicide Prevention Toolkit For Men" align="center" width="10" height="10" position="0 0 0"></a-text>
                        <a-text  color="#000" value="Recipient of Best of HackOn 2.0" align="center" width="10" height="10" position="0 -1 0"></a-text>
                    </a-entity>
                
                <a-entity>
            </a-scene>
        `);
        }else if (toggles["#ideas_key"]) {
            $("#marker_check").html(`
        <a-scene embedded height="100%">
            <a-entity id="rain" particle-system="preset: dust; color: #FFFFFF; particleCount: 5000"></a-entity>

            <a-entity position="0 0 -20" rotation="0 0 0">
                <a-torus color="#56cfe1" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                <a-text color="#000" value="Can we apply synthetic controls to storytelling?" font="kelsonsans" wrap-count="19" align="center" width="8" height="8" position="0 2 0"></a-text>
                <a-text wrap-count="20" color="#000"value="What happens to Character A if they were born into Family B (rather than Family A)? Can personalizing storytelling increase diversity?" align="center" width="6" height="6" position="0 -1 0"></a-text>
            </a-entity>
            <a-entity position="0 0 20" rotation="0 -180 0">
                <a-torus color="#ffd639" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                <a-text color="#000" value="Intonation as a factor for text-to-speech?" font="kelsonsans" wrap-count="19" align="center" width="8" height="8" position="0 2 0"></a-text>
                <a-text wrap-count="20" color="#000"value="Can we train our models by listening to audio books?" align="center" width="6" height="6" position="0 -1 0"></a-text>
            </a-entity>
                <a-entity position="20 0 0" rotation="0 -90 0">
                <a-torus color="#bfd200" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                <a-text color="#000" value="Personalized Education?" font="kelsonsans" wrap-count="19" align="center" width="8" height="8" position="0 2 0"></a-text>
                <a-text wrap-count="20" color="#000" value="How could a computer customize analogies to fit a person's upbringing? If we build analogies charged with sensory data, might we build visual representations too?" align="center" width="6" height="6" position="0 -1 0"></a-text>
            </a-entity>
            <a-entity position="-20 0 0" rotation="0 90 0">
                <a-torus color="#7678ed" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                <a-text color="#000" value="Spotify for Animals?" font="kelsonsans" wrap-count="19" align="center" width="8" height="8" position="0 2 0"></a-text>
                <a-text wrap-count="20" color="#000"value="Rather than human rock n' roll stars, why not have animals walk the red carpet? For animals in extinction, maybe all they need is a celebrity among them. 'Yo, did you listen to Jojo the Javan Rhino?'" align="center" width="5" height="5" position="0 -1 0"></a-text>
            </a-entity>
        
            <a-entity>
        </a-scene>
        `);
        } else if (toggles["#writing_key"]) {
            $("#marker_check").html(`
        <a-scene embedded height="100%">
            <a-entity id="rain" particle-system="preset: dust; color: #FFFFFF; particleCount: 5000"></a-entity>

            <a-entity position="0 0 -20" rotation="0 0 0">
                <a-torus color="#56cfe1" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                <a-text wrap-count="20" color="#000"value="Life is a string of contradictions beautifully arranged by a thing called time." align="center" width="6" height="6"></a-text>
            </a-entity>
            <a-entity position="0 0 20" rotation="0 -180 0">
                <a-torus color="#ffd639" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                <a-text wrap-count="20" color="#000"value="12 pm yellows on turtle-back leaves summer snow rivers white ash on green" align="center" width="6" height="6"></a-text>
            </a-entity>
                <a-entity position="20 0 0" rotation="0 -90 0">
                <a-torus color="#bfd200" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                <a-text wrap-count="20" color="#000" value="'how should i not form a thought?'--'but you have to go to bed.'--'can't sleep.'--'try.'--'let me write instead.'" align="center" width="6" height="6"></a-text>
            </a-entity>
            <a-entity position="-20 0 0" rotation="0 90 0">
                <a-torus color="#7678ed" arc="360" radius="6" radius-tubular="0.1" position="0 0 -2"></a-torus>
                <a-circle color="#FFF" radius="5" position="0 0 -2"></a-circle>
                <a-text wrap-count="20" color="#000"value="how can i describe a thought / that hasn't many legs / but often gives to flying / sleepless nights in bed" align="center" width="5" height="5"></a-text>
            </a-entity>
        
            <a-entity>
       </a-scene>
        `);
        }
        });
        return(
            <div>
                <button> Go Back </button>
            </div>
        )
    }

};



$(document).ready(function(){
    ReactDOM.render(<Welcome />, document.querySelector("#loadAR"));
});
