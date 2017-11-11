let imagenes = [];
let contador = 0;
let currentLayout = 1;
let cb = new Codebird;
cb.setConsumerKey("iOd7FdG7T3dE1asEHOFxLmdKr", "VdkGM4SSycjpkKrALkwbrO7aQiz696d6twGrVVRcYTvJDS00xQ");
cb.setToken("1368012535-kTk798jfE3ySB8ObnlWCzqNJ8uydUqvFEfkTyAk", "NkBbB1mistXTu7JWC77gdCC1WMmRnNQVQarg6HHOijCca");
let finalizado = false;

//cb.setProxy("https://cb-proxy.herokuapp.com/");

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
            likes: tweet.favorite_count,
            classLike: Math.floor(Math.random()*3)+1
          };
          if(!contains(imagenes,info)){
            imagenes.push(info);
          }
        }
      }
      if (!finalizado) {
        finalizado = true;
        llamado(hash, "recent");
      }
      else {
        mostrarImagenes();
        finalizado = false;
      }
    }
  );
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i].url === obj.url) {
           return true;
       }
    }
    return false;
}

function mostrarImagenes() {

  $(".grid").html(""); // Limpiamos las imagenes que estan en el html
  layout.masonry('reloadItems');

  $.get('templates/imagen.mst', function(template) {
    let rendered = $(Mustache.render(template, {imagenes: imagenes}));
    layout.append(rendered).masonry( 'appended', rendered);

    layout.imagesLoaded().progress(function () {
      $(".home").addClass("d-none");
      $(".gallery").removeClass("d-none");
      $(".small-loading-icon").addClass("d-none");
      $(".input-search").val("");
      layout.masonry();
    });
  });

  layout.masonry();
}



$(".search-bar").on("submit", function (ev) {
  ev.preventDefault();
  imagenes = [];
  let searchData = $(this).serializeArray()[0].value;
  $(".loading-icon").addClass("fade-loading");
  $(".small-loading-icon").removeClass("d-none");
  llamado(searchData, "popular");
});

$(document).on("click", ".arrow", function () {

  let elements = [];
  $(".grid__item_layout_2").each(function () {
    if($(this).css("display") != "none") elements.push($(this));
  })



  if($(this).hasClass("fa-arrow-circle-right")){
    let next = elements[elements.length - 1].next(".img-container");
    if(next.length > 0){
      next.css("display", "initial");
      elements[0].css("display", "none");
    }
  }
  else {
    let previous = elements[0].prev(".img-container");
    if(previous.length > 0){
      previous.css("display", "initial");
      elements[elements.length - 1].css("display", "none");
    }
  }
  layout.masonry();
});