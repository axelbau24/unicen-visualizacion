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

  layout.imagesLoaded().progress(function () {
    layout.masonry();
  });
}

llamado("#landscape", "popular");

