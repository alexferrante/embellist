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
        
        var playlistEnergy = 0;
        var playlistMode = 0;
        var playlistTempo = 0;
        var playlistValence = 0;

        for (i = 0; i < data.audio_features.length; i++) {
            playlistEnergy += data.audio_features[i].energy * (1/data.audio_features.length);
            playlistMode += data.audio_features[i].mode * (1/data.audio_features.length);
            playlistValence += data.audio_features[i].valence * (1/data.audio_features.length);
            playlistTempo += data.audio_features[i].tempo * (1/data.audio_features.length);
        }
        
        
        //determine starting hues (determined by modality)

        if (playlistMode < .5) {
            const R = playlistMode * (255 - 0);
            const G = 1 - playlistMode * (255 - 0);
            const B = 1 - playlistMode * (255 - 0);
        }

        
        playlistEnergy //determines saturation
        playlistValence //determines lightness

        // will probably need to move removal of cookies i.e. need playlist id for upload, but have to remove cookies in this script 
        Cookies.remove("track_ids"); 
        Cookies.remove("playlist_id");
    });
}
