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
        mostrarImagenes(hash);
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

function mostrarImagenes(hash) {

  if($(".list-group-item").data("id") == 1) {
      changeLayout($(".list-group-item").eq(0));
  }
  $(".mensajeError, #hashtag").html("");

  $.get('templates/imagen.mst', function(template) {
    $(".grid").html(""); // Limpiamos las imagenes que estan en el html
    layout.masonry('reloadItems');
    let rendered = $(Mustache.render(template, {imagenes: imagenes}));
    layout.append(rendered).masonry( 'appended', rendered);

    if (imagenes.length !=0){
    layout.imagesLoaded().progress(function () {
      $(".home").addClass("d-none");
      $(".gallery").removeClass("d-none");
      $(".input-search").val("");
      layout.masonry();
    });
  }
  else {
    $(".mensajeError, #hashtag").html("No se encontraron resultados con " + hash);
    $(".mensajeError").removeClass("d-none");

  }
    $(".loading-icon, .small-loading-icon").addClass("d-none");
  });

  layout.masonry();
  $("#hashtag").html(hash);
}



$(".search-bar").on("submit", function (ev) {
  ev.preventDefault();
  imagenes = [];
  let searchData = $(this).serializeArray()[0].value;
  $(".loading-icon, .small-loading-icon").removeClass("d-none");
  $(".mensajeError").addClass("d-none");
  $(".loading-icon").addClass("fade-loading");
  llamado(searchData, "popular");
});

$(".close").on("click", function(){
  $(".clicked-image").css("display", "none");
});