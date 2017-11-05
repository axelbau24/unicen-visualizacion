let imagenes = [];
let contador = 0;
let layout = 1;
let cb = new Codebird;
cb.setConsumerKey("iOd7FdG7T3dE1asEHOFxLmdKr", "VdkGM4SSycjpkKrALkwbrO7aQiz696d6twGrVVRcYTvJDS00xQ");
cb.setToken("1368012535-kTk798jfE3ySB8ObnlWCzqNJ8uydUqvFEfkTyAk", "NkBbB1mistXTu7JWC77gdCC1WMmRnNQVQarg6HHOijCca");
let finalizado = false;


function llamado(hash,type){
  var params = {
      count:100,
      q: hash,
      result_type: type
  };
  cb.__call(
      "search_tweets",
      params,
      function (reply) {
        for (var i = 0; i < reply.statuses.length; i++) {
          let tweet = reply.statuses[i];
          if(tweet.extended_entities && tweet.extended_entities.media[0].type == "photo"){
            var info = {
                url: tweet.extended_entities.media[0].media_url,
                likes: tweet.favorite_count
            };
            imagenes.push(info);
          }
        }
        if(!finalizado){
          finalizado = true;
          llamado(hash, "recent");
        }
        else {
          mostrarImagenes();
        }
      }
  );
}

function mostrarImagenes(){
  $('.img-container').each(function(){

    //$(this).find(".like-count").html(imagenes[contador].likes);
    $(this).find(".image").attr("src", imagenes[contador++].url)
  });

  $layout.imagesLoaded().progress( function() {
    $layout.masonry();
  });
}

llamado("#messi","popular");

var $layout = $(".grid").masonry({
  itemSelector: ".grid__item_layout_" + layout,
  columnWidth: ".grid__sizer",
  gutter: 15,
  transitionDuration: 0,
  fitWidth: true,
 });

 
$(".dropdown").on("click", function () {
  $(".dropdown-content").toggleClass("d-none");
});

$(".layout-option").on("click", function () {
  layout = $(this).data("id");

  switch (layout) {
    case 1:
      $(".big-image-container").addClass("d-none");
      $(".layout-grid").removeClass("col-4").addClass("col");
      $(".grid__item_layout_2").removeClass("grid__item_layout_2").addClass("grid__item_layout_1");
      break;
  
    case 2:
      $(".big-image-container").removeClass("d-none");
      $(".layout-grid").removeClass("col").addClass("col-4");
      $(".grid__item_layout_1").removeClass("grid__item_layout_1").addClass("grid__item_layout_2");
      
      break;
  }
  $layout.masonry();
});