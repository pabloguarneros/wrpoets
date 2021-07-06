$("document").ready(function(){
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        $("#top_block h1").css({
            "font-size":"26px"
        })
        $(".blocks").addClass("phone_version").removeClass("page_start");
        $("#middle_circle").addClass("phone_version").removeClass("page_start");
        $(".block_content").addClass("phone_version").removeClass("page_hovering");
        $(".go_back").addClass("phone_version");
        
    } else{
        $("#home_wrapper").mouseenter(function(){
            $(".page_start").addClass("page_hovering").removeClass("page_start");
        }).mouseleave(function(){
            $("#left_block.page_hovering").addClass("page_start").removeClass("page_hovering");
            $("#right_block.page_hovering").addClass("page_start").removeClass("page_hovering");
            $("#middle_circle.page_hovering").addClass("page_start").removeClass("page_hovering");
            if(!$("#left_block").hasClass("page_active")&!$("#right_block").hasClass("page_active")){
                $("#top_block.page_hovering").addClass("page_start").removeClass("page_hovering");
                };
        });
        $("#middle_circle").mouseenter(function(){
            $("#middle_circle").addClass("page_active").removeClass("page_hovering");
        }).mouseleave(function(){
            $("#middle_circle").addClass("page_hovering").removeClass("page_active");
        });
        $(".blocks").on('click',function(e){
            var block = e.currentTarget;
            if(!$(block).hasClass("page_active")){
                $(block).addClass("page_active").removeClass("page_start");
                $(`#${block.id} .block_content`).addClass("text_appear").removeClass("page_hovering");
                $("#middle_circle").addClass("block_active").removeClass("page_hovering");
            }else{
                $(block).addClass("page_start").removeClass("page_active");
                $(`#${block.id} .block_content`).addClass("page_hovering").removeClass("text_appear");
                $("#middle_circle").addClass("page_hovering").removeClass("block_active");
            }
        });
    } // ENDS MOBILE DETECT

$("#verse").on('click',function(){
    if (!$("#top_block").hasClass("page_active")){
        $("#top_block").addClass("page_active").removeClass("page_hovering");
        $(".blocks").addClass("disappear");
        $("#middle_circle").addClass("disappear");
        $("#center_scene").css({"opacity":"1"})
        $("#verse").css({"display":"none"})
        $(".go_back").removeClass("off");
    };
})

$(".go_back").on('click',function(){
    console.log("yeye");
    $("#top_block").addClass("page_hovering").removeClass("page_active");
    $(".blocks").removeClass("disappear");
    $("#middle_circle").removeClass("disappear");
    $(".go_back").addClass("off");
});
});