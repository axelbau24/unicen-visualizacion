
let selectedFilter;
const FILTER_SLIDER_ID = "#slider";
const SLIDER_CONTAINER_ID = "#sliderContainer";

bindBtn("negative", new Negative());
bindBtn("border-detection", new ConvolutionFilter([-1, -1, -1, -1,  8,  -1, -1, -1, -1]));
bindBtn("desenfoque", new ConvolutionFilter([1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]));
bindBtn("brightness", new Brightness(100), true);
bindBtn("binary", new Binary(128), true);
bindBtn("sepia", new Sepia(100), true);
bindBtn("greyscale", new GrayScale());

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
