
let carouselElements = [];
$(document).on("click", ".arrow .fa", function () {

    carouselElements = [];
    fillCarouselArray();

    if ($(this).hasClass("fa-arrow-circle-right")) {
        let next = carouselElements[carouselElements.length - 1].next(".img-container");
        if (next.length > 0) {
            next.css("display", "initial");
            carouselElements[0].css("display", "none");
        }
    }
    else {
        let previous = carouselElements[0].prev(".img-container");
        if (previous.length > 0) {
            previous.css("display", "initial");
            carouselElements[carouselElements.length - 1].css("display", "none");
        }
    }
    layout.masonry();
});

// Cambios de imagenes automatico en carousel
let currentImage = 0;
let foward = true;
setInterval(function () {
    if (currentLayout == 2) {
        if(currentImage == $(".img-container").length - 1) foward = false;
        else if(currentImage == 0) foward = true;

        if(foward) currentImage++;
        else currentImage--;

        if (carouselElements.length == 0) fillCarouselArray();
        if(foward) $(".fa-arrow-circle-right").eq(0).click();
        else $(".fa-arrow-circle-left").eq(0).click();
        $(".img-container").eq(currentImage).click();
    }

}, 5000);

function fillCarouselArray() {
    $(".grid__item_layout_2").each(function () {
        if ($(this).css("display") != "none") carouselElements.push($(this));
    });
}
