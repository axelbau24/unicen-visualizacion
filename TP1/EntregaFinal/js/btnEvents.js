
let selectedFilter;
const FILTER_SLIDER_ID = "#slider";
const SLIDER_CONTAINER_ID = "#sliderContainer";

bindBtn("negative", new Negative(canvas));
bindBtn("brightness", new Brightness(canvas, 100), true);
bindBtn("binary", new Binary(canvas, 128), true);
bindBtn("sepia", new Sepia(canvas, 100), true);
bindBtn("greyscale", new GrayScale(canvas));

function bindBtn(btnId, filter, canChangeLevels) {
  let btn = document.getElementById(btnId);

  btn.addEventListener('click', function() {
    if(canChangeLevels) $(SLIDER_CONTAINER_ID).show("slow");
    else $(SLIDER_CONTAINER_ID).hide("slow");
    
    updateCurrentImage(filter);
    selectedFilter = filter;
  });

}


$(function() {
  let slider =  $(FILTER_SLIDER_ID);
  slider.slider();
  $(SLIDER_CONTAINER_ID).hide();
} );

$(FILTER_SLIDER_ID).slider({
  slide: function(event, ui) {
    selectedFilter.setLevel(ui.value);
    updateCurrentImage(selectedFilter);
  }
});
