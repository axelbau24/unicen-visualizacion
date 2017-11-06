let imagenes = [];
let contador = 0;
let currentLayout = 1;
let cb = new Codebird;
cb.setConsumerKey("iOd7FdG7T3dE1asEHOFxLmdKr", "VdkGM4SSycjpkKrALkwbrO7aQiz696d6twGrVVRcYTvJDS00xQ");
cb.setToken("1368012535-kTk798jfE3ySB8ObnlWCzqNJ8uydUqvFEfkTyAk", "NkBbB1mistXTu7JWC77gdCC1WMmRnNQVQarg6HHOijCca");
let finalizado = false;


function llamado(hash, type) {
  var params = {
    count: 100,
    q: hash,
    result_type: type
  };
  cb.__call(
    "search_tweets",
    params,
    function (reply) {
      for (var i = 0; i < reply.statuses.length; i++) {
        let tweet = reply.statuses[i];
        if (tweet.extended_entities && tweet.extended_entities.media[0].type == "photo") {
          var info = {
            url: tweet.extended_entities.media[0].media_url,
            likes: tweet.favorite_count
          };
          imagenes.push(info);
        }
      }
      if (!finalizado) {
        finalizado = true;
        llamado(hash, "recent");
      }
      else {
        mostrarImagenes();
      }
    }
  );
}

function mostrarImagenes() {
  $('.img-container').each(function () {

    $(this).find(".like-count").html(imagenes[contador].likes);
    $(this).find(".image").attr("src", imagenes[contador++].url)
  });

  $(".selected-image").attr("src", getRandomImage());
  
  layout.imagesLoaded().progress(function () {
    layout.masonry();
  });
}

llamado("#landscape", "popular");

let layout = createLayout();

function createLayout() {
  return $(".grid").masonry({
    itemSelector: ".grid__item_layout_" + currentLayout,
    columnWidth: ".grid__sizer",
    gutter: 15,
    transitionDuration: 0,
    fitWidth: currentLayout == 1,
  });
}

function updateLayout() {
  layout.masonry({
    itemSelector: ".grid__item_layout_" + currentLayout,
    fitWidth: currentLayout == 1
  });
}


$(".dropdown").on("click", function () {
  $(".dropdown-content").toggleClass("d-none");
});

function getRandomImage(){
  let img = Math.floor(Math.random() * imagenes.length);
  return imagenes[img].url;
}

$(".layout-option").on("click", function () {
  currentLayout = $(this).data("id");
  updateLayout();
  
  switch (currentLayout) {
    case 1:
      $(".big-image").addClass("d-none");
      $(".grid__item_layout_2").removeClass("grid__item_layout_2").addClass("grid__item_layout_1");
      break;
      
      case 2:
      $(".big-image").removeClass("d-none");
      $(".layout").width("auto");
      $(".grid__item_layout_1").removeClass("grid__item_layout_1").addClass("grid__item_layout_2");
      break;
  }
  layout.masonry();
   
});

$(".img-container").on("click", function () {
  if(currentLayout == 2){
    let image = $(this).find(".image").attr("src");
    $(".selected-image").attr("src", image);
    layout.masonry();
  }
});