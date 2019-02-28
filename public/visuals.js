// visuals.js

let playlist_id = Cookies.get("playlist_id"); 
let accessToken = Cookies.get("access_token");

if (playlist_id && accessToken) {
    
    $.get({url: '/playlist', headers:{"Authorization": `Bearer ${accessToken}`}, data: {playlist_id}}, function(data) {
        var playlistName = $('<h2>' + data.name + '</h2>');
        playlistName.appendTo($('.mainCont')); 
    });

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
    genImage();
    $('#upload').click(function() {
        var cover_image = Cookies.get("cover_image");
        var playlist_id = Cookies.get("playlist_id");
        $.ajax({
            type: "PUT",
            url: `https://api.spotify.com/v1/playlists/${playlist_id}/images`, 
            headers:{"Authorization": `Bearer ${accessToken}`,
                     'Content-Type': 'image/jpeg'},
            data: cover_image, 
            success: function() {
                console.log('uploaded pic');
            }
        });
    });
    $('#retry').click(function() {
        $('.sideCont img').remove();
        genImage();
    });
}

function genImage() {
    let track_ids = Cookies.get("track_ids");
    $.get({url: '/trackData', headers:{"Authorization": `Bearer ${accessToken}`}, data: {track_ids}}, function(data) {
        var playlistEnergy = 0;
        var playlistMode = 0;
        var playlistValence = 0;

        for (i = 0; i < data.audio_features.length; i++) {
            try {
                playlistEnergy += data.audio_features[i].energy * (1/data.audio_features.length);
                playlistMode += data.audio_features[i].mode * (1/data.audio_features.length);
                playlistValence += data.audio_features[i].valence * (1/data.audio_features.length);
            } catch (e) { } //pass over local files, which will have null feature values 
        }
        //determine hue component of HSL coloring (range of cold v. warm colors)
        if (playlistMode < .5) {
            var H = Math.floor(Math.random() * (283 - 63) + 63) //range of "cool" hue values
        } else {
            var H = Math.floor(Math.random() * (422 - 284) + 284)
            if (H > 360) { H = H - 360}
            //var H = //random number from 0 to 62 or 284 to 360 
        }
        //determine saturation component of HSL coloring 
        var S = Math.floor(playlistEnergy * 100);
        //determine lightness component of HSL coloring 
        var L = Math.floor(playlistValence * 100);
        var c = document.createElement('canvas');
        c.width = 300;
        c.height = 300; 
        var canvas = c.getContext("2d");
        canvas.id = 'playlist_cover';
        canvas.fillStyle = 'hsl('+H+','+S+'%,'+L+'%)';
        canvas.fillRect(0, 0, 300, 300);
        var cover_image = c.toDataURL("image/jpeg");
        var str =  cover_image.replace(/^data:image\/(jpeg);base64,/, "");
        Cookies.set("cover_image", str);
        var img = document.createElement('img');
        img.src = cover_image;
        img.style = 'display: block';
        img.style = 'margin: 0 auto';
        $(".sideCont").append(img);
    });
}
