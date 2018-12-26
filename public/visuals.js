// visuals.js

var visualsView = document.getElementById('view');
let playlist_id = Cookies.get("playlist_id"); 
let accessToken = Cookies.get("access_token");

if (playlist_id && accessToken) {
    // get selected playlist's tracks
    $.get({url: '/playlistTracks', headers:{"Authorization": `Bearer ${accessToken}`}, data: {playlist_id}}, function(data) {
        
        if (data.items.length == 0) {
            var noResults = $('<h3>No results found! Please try again.</h3>');
            noResults.appendTo('body');
        }

        var tracks = [];
        for (count = 0; count < data.items.length; count++) {
            tracks.push(data.items[count].track.id);
        }

        Cookies.set("track_ids", JSON.stringify(tracks));
    });  

    // *unelegant* way of passing track ids for feature analysis 
    let track_ids = Cookies.get("track_ids");
    $.get({url: '/trackData', headers:{"Authorization": `Bearer ${accessToken}`}, data: {track_ids}}, function(data) {
        console.log(data);
    });
}
