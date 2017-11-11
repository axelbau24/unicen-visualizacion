
let carouselElements = [];
$(document).on("click", ".arrow", function () {

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
setInterval(function () {
    if (currentLayout == 2) {
        if (carouselElements.length == 0) fillCarouselArray();
        carouselElements[currentImage++].eq(0).click();
        if (currentImage == carouselElements.length) {
            currentImage = 0;
            for (var i = 0; i < carouselElements.length; i++) {
                $(".fa-arrow-circle-right").eq(0).click();
            }
        }
    }

}, 5000);

function fillCarouselArray() {
    $(".grid__item_layout_2").each(function () {
        if ($(this).css("display") != "none") carouselElements.push($(this));
    });
}