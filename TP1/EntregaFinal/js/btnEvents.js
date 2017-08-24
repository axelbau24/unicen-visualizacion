
let selectedFilter;
let slider;
const FILTER_SLIDER_ID = "#slider";
const SLIDER_CONTAINER_ID = "#sliderContainer";

bindFilters();
// Se le asigna a cada boton su respectivo filtro
function bindFilters() {
  bindBtn("negative", new Negative());
  bindBtn("saturacion", new Saturation(), true);
  bindBtn("border-detection", new ConvolutionFilter([-1, -1, -1, -1,  8,  -1, -1, -1, -1]));
  bindBtn("sharpen", new ConvolutionFilter([0, -1, 0, -1,  5,  -1, 0, -1, 0]));
  bindBtn("desenfoque", new Blur(), true);
  bindBtn("brightness", new Brightness(100), true);
  bindBtn("binary", new Binary(128), true);
  bindBtn("sepia", new Sepia(100), true);
  bindBtn("greyscale", new GrayScale());
}

function bindBtn(btnId, filter, canChangeLevels) {
  let btn = document.getElementById(btnId);
  // Clonamos el boton para asi eliminar los eventos actuales (si tuviese)
  let newBtn = btn.cloneNode(true);
  btn = btn.parentNode.replaceChild(newBtn, btn);

  newBtn.addEventListener('click', function() {
    btnEvent(filter, canChangeLevels);
  });

}


function btnEvent(filter, canChangeLevels) {
  $(".canvas-background").removeClass("hidden");
  if(canChangeLevels) {
    $(SLIDER_CONTAINER_ID).show("slow");
    resetSlider();
    updateFilterLevel(filter, 50);
  }
  else $(SLIDER_CONTAINER_ID).hide("slow");

  setTimeout(() => {
    updateCurrentImage(filter);
    $(".canvas-background").addClass("hidden");
  }, 25);

  selectedFilter = filter;
}

slider =  $(FILTER_SLIDER_ID);
slider.slider();
resetSlider();
$(SLIDER_CONTAINER_ID).hide();


slider.slider({
  slide: function(event, ui) {
    updateFilterLevel(selectedFilter, ui.value);
    updateCurrentImage(selectedFilter);
  },
});

function updateFilterLevel(filter, level) {
  filter.setLevel(level);
}

function resetSlider() {
  slider.slider("value", 50);
}
