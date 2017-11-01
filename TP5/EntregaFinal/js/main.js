var cb = new Codebird;
cb.setConsumerKey("iOd7FdG7T3dE1asEHOFxLmdKr", "VdkGM4SSycjpkKrALkwbrO7aQiz696d6twGrVVRcYTvJDS00xQ");
cb.setToken("1368012535-kTk798jfE3ySB8ObnlWCzqNJ8uydUqvFEfkTyAk", "NkBbB1mistXTu7JWC77gdCC1WMmRnNQVQarg6HHOijCca");

var params = {
    q: "#messi",
    result_type: "popular"
};
cb.__call(
    "search_tweets",
    params,
    function (reply) {
      for (var i = 0; i < reply.statuses.length; i++) {
        let tweet = reply.statuses[i];
        if(tweet.extended_entities && tweet.extended_entities.media[0].type == "photo"){
          console.log(tweet.favorite_count);
          console.log(tweet.extended_entities.media[0].media_url);
        }
      }
    }
);
