import $ from 'jquery';

function openBackpack(){
    $("#backpack_content").css("display","flex");
    $("#interaction_toggles").css("display","none");
}

function closeBackpack(){
    $("#backpack_content").css("display","none");
    $("#interaction_toggles").css("display","flex");
}

function openPlantMemory(){
    $("#collection_cards").css("display","none");
    $("#planting_memories").css("display","flex");
}
function closePlantMemory(){
    $("#collection_cards").css("display","flex");
    $("#planting_memories").css("display","none");
}

$(document).ready(function(){
    $("#backpack_trigger").on('click',openBackpack);
    $("#trigger_exit").on('click',closeBackpack);
    $("#trigger_garden").on('click',openPlantMemory);
});