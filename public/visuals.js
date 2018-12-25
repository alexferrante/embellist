var visualsView = document.getElementById('view');
let playlist_id = Cookies.get("playlist_id"); 
let accessToken = Cookies.get("access_token");

if (playlist_id && accessToken) {
    
    $.get({url: '/playlistTracks', headers:{"Authorization": `Bearer ${accessToken}`}, data: {playlist_id}}, function(data) {
        
        if (data.items.length == 0) {
            var noResults = $('<h3>No results found! Please try again.</h3>');
            noResults.appendTo('#searchResults');
        }

        body.items.forEach(function(track) {
            
        });

    });
}
