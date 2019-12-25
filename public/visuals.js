// visuals.js

let playlist_id = Cookies.get("playlist_id"); 
let accessToken = Cookies.get("access_token");

var playlistEnergy = 0;
var playlistValence = 0;
var playlistMode = 0;
var playlistPopularity = 0;

if (playlist_id && accessToken) {
    var display_name = Cookies.get("display_name");
    var user_image = Cookies.get("user_image");
    Cookies.set('offset', -1);

    if (user_image) {
        $('#user').attr("src", user_image);
        $('#user').attr("width", "40px");
        $('#user').attr("padding", "0");
        $('#user').attr("margin", "0");
        $('#user').css("border-radius", "50%");
    }
    if (display_name) {
        $('#displayName').text(display_name);
    }

    $.when(
        $.get({url: '/playlist', headers:{"Authorization": `Bearer ${accessToken}`}, data: {playlist_id}}, function(data) {
            var playlistName = $('<h2>' + data.name + '</h2>');
            playlistName.appendTo($('.mainCont')); 
            if (data.tracks.total > 100) {
                Cookies.set('offset', 0)
            }
            var numRequests = Math.floor(data.tracks.total / 100) + 1;
            for (i = 0; i <= numRequests; i++) { 
                $.get({url: '/playlistTracks', headers:{"Authorization": `Bearer ${accessToken}`}, data: {playlist_id}}, function(data) {
            
                    if (data.items.length == 0) {
                        var noResults = $('<h3>No results found! Please try again.</h3>');
                        noResults.appendTo('body');
                    }
                    var tracks = [];
                    for (count = 0; count < data.items.length; count++) {
                        tracks.push(data.items[count].track.id);
                        playlistPopularity += data.items[count].track.popularity * (1/data.items.length);
                    }
                    let currTracks = Cookies.get('track_ids').split(",");
                    let newTracks = currTracks.concat(tracks);
                    Cookies.set('track_ids', newTracks.join(','));
                    console.log(newTracks);
                })
                Cookies.set('offset', parseInt(Cookies.get('offset')) + 99);
            }
            Cookies.set('offset', -1);
        })  
    )
    .done(function() {
        getData();
    })
    .fail(function() {
        console.log(err);
    })
}

$('#logout').click(function() {
    Cookies.remove('access_token');
    Cookies.remove('display_name');
    Cookies.remove('user_image');
    Cookies.remove('user_id');
    Cookies.remove('playlist_id');
    Cookies.remove('track_ids');
    window.location.href = '/';
});

$('#upload').click(function() {
    var cover_image = Cookies.get("cover_image");
    var playlist_id = Cookies.get("playlist_id");
    $.ajax({
        type: "PUT",
        url: `https://api.spotify.com/v1/playlists/${playlist_id}/images`, 
        headers:{"Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'image/jpeg'},
        data: cover_image, 
        success: function() {   }
    });
});

$('#retry').click(function() {
    $('.sideCont img').remove();
    genImage();
});

function getData() {
    let track_ids = Cookies.get("track_ids").split(",");
    
    if (track_ids.length >= 100) {
        track_ids = track_ids.slice(0, 87);
    }

    console.log(track_ids);
 
  
     $.get({url: '/trackData', headers:{"Authorization": `Bearer ${accessToken}`}, data: {track_ids}}, function(data) {
            console.log('p');
            for (i = 0; i < data.audio_features.length; i++) {
                try {
                    playlistEnergy += data.audio_features[i].energy * (1/data.audio_features.length);
                    playlistMode += data.audio_features[i].mode * (1/data.audio_features.length);
                    playlistValence += data.audio_features[i].valence * (1/data.audio_features.length);
                } catch (e) { } // ignore local files 
            }
            genImage();
            genDataVis();
        });
    
}

function genDataVis() {
    var popCtx = $("<canvas id='popChart'><canvas");
    $('.mainCont').append(popCtx)
    var dvStr = "";
    if (playlistPopularity <= 40) {
        dvStr = "not widely popular";
    } else if (playlistPopularity <= 65 && playlistPopularity > 40) {
        dvStr = "relatively popular";
    } else {
        dvstr = "averagely popular";
    }
    var dv = $(`<div>Your music taste is ${dvStr} on Spotify!</div>`);
    var desc = $(`<div>On a scale of 0-100 your playlist scored ${Math.round(playlistPopularity)} in terms of song popularity</div>`)
    // var popChart = new Chart($("#popChart"), {
    //     type: 'doughnut',
    //     data: {
    //         datasets: [{
    //             data: [playlistPopularity, 100 - playlistPopularity],
    //             labels: [
    //                 'Popularity',
    //             ],
    //             backgroundColor: [
    //                 'rgba(255,0,0,0.3)'
    //             ]
    //         }]
    //     }
    // });
    // var enCtx = $("<canvas id='energyChart'><canvas");
    // $('.mainCont').append(enCtx)
    
    $('.mainCont').append(dv);
    $('.mainCont').append(desc);
   
}

function genImage() {
        //determine hue component of HSL coloring (range of cold v. warm colors)
        if (playlistMode < .5) {
            var H = Math.floor(Math.random() * (283 - 63) + 63)
        } else {
            var H = Math.floor(Math.random() * (422 - 284) + 284)
            if (H > 360) { H = H - 360}
        }
        var S = Math.floor(playlistEnergy * 100);
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
}

