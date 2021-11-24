import $ from 'jquery';

function load_garden(object){
    $("#planting_memories").append(`
    <div class="memory_item fc ac">
        <img src="${object.photo}" alt="Photo by ${object.author} taken in ${object.location}"></img>
        <div class="meta_data fc">
            <a class="gg_bottom" href="${object.link}" target="_blank">
                &#128123 </br> 
                ${object.author} </br> </br>
                &#128205 </br> 
                ${object.location}</a>
        </div>
    </div>`);
}

function load_pets(object){
    $("#pet_memories").append(`
        <div class="memory_item fc ac">
            <img src="${object.photo}" alt="Photo by ${object.author} taken in ${object.location}"></img>
            <div class="meta_data fc">
                <p class="gg_bottom"> ${object.author}'s Super Cute &#128062 &#128062</p>
            </div>
        </div>`);
}

function load_art(object){
    $("#art_memories").append(`
    <div class="memory_item fc ac">
        <img src="${object.photo}" alt="Photo uploaded in ${object.author}'s art interview project."></img>
        <div class="meta_data fc">
            <a class="gg_bottom" href="${object.link}" target="_blank">
                &#127912  </br> </br>
                ${object.author}'s </br>
                Art-ploration </br> </br>
                Click me to find out more! </br> </br>
                &#127912
            </a>
        </div>
    </div>`);
}

async function fetch_html_media() {
    const api = `/nubes/minerva/get_remote_experiences?category=1`;
    fetch(api)
        .then(response => response.json())
        .then(function(data){
            for (var i = 0; i < data.length; i++){
                switch (data[i].memory_category){
                    case 1:
                        if (data[i].link){ load_garden(data[i]) };
                        break
                    case 2:
                        load_pets(data[i]);
                        break
                    case 3:
                        if (data[i].link) { load_art(data[i]) };
                }
            }
        });
  }

export {fetch_html_media};