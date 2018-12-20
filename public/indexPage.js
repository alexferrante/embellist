// client-side js
var access_token, device_id; // Device id used for playback SDK
$('#searchResults').hide();

$('#login').click(function() {
  $.get('/authorize', function(data) {
    window.location = data;
  });
});

$('#logout').click(function() {
  Cookies.remove('access_token');
  Cookies.remove('display_name');
  Cookies.remove('avatar_url');
  Cookies.remove('ext_device_id');
  Cookies.remove('track_id');
  window.location.href = '/';
});

const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
  window.location.hash = '';

if (hash.access_token) {
  var expires_in = new Date(new Date().getTime() + hash.expires_in*1000);
  Cookies.set('access_token', hash.access_token, {expires: expires_in});
  window.location.href = '/';
}

access_token = Cookies.get('access_token');

// Logged in
if (access_token) {
  $('#loggedOut').hide();
  $('#loggedIn').fadeIn(500);

  var display_name = Cookies.get("display_name");
  var avatar_url = Cookies.get("avatar_url");
  if (avatar_url) {
    $('#avatar').attr("src", avatar_url);
    $('#avatar').attr("width", "40px");
    $('#avatar').css("border-radius", "50%");
    $('#avatar').css("float", "left");
  }
  if (display_name) {
    $('#displayName').text(display_name);
  }

  if (!display_name && !avatar_url) {
    // Get logged in user info
    $.get({url: '/me', headers: {"Authorization": `Bearer ${access_token}`}}, function(data) {
      // "Data" is the array of track objects we get from the API. See server.js for the function that returns it.
      if (data.images.length > 0) {
        Cookies.set("avatar_url", data.images[0].url);
        $('#avatar').attr("src", data.images[0].url);
        $('#avatar').attr("width", "40px");
        $('#avatar').css("border-radius", "50%");
        $('#avatar').css("float", "left");
      }
      Cookies.set("display_name", data.display_name);
      $('#displayName').text(data.display_name);
    });
  }
  showPlaylists();
}
else {
  // Not logged in
  $('#loggedIn').hide();
  $('#loggedOut').fadeIn(500);
}

function showPlaylists() {
  $('#searchResults').fadeOut(500);
  $('#logoLoggedIn').fadeOut(200);
  $.get({url: '/playlists', headers: {"Authorization": `Bearer ${access_token}`}}, function(data) {
    
    if (data.items.length == 0) {
      var noResults = $('<h3>No results found! Please try again.</h3>');
      noResults.appendTo('#searchResults');
    }
   
    data.items.forEach(function(playlist) {
      var container = $('<div></div>');
      container.addClass('container');

      container.on('click', function() {
        $('body').fadeOut(500, function() {
         // window.location.href = `/visual/#playlist_id=${playlist.id}`;
        });
      });

      var cover = $('<img>');
      cover.attr("src", playlist.images[0].url);
      cover.attr("width", "200px");
      cover.appendTo(container);

      var playlistName = $('<h5 style="font-size: 15px;">' + playlist.name + '</h5>');
      playlistName.appendTo(container);

      container.appendTo('#searchResults');
    });
    $('#searchResults').fadeIn(500);
  });
}

$(window).resize(function(){
  /*
  var w = window.innerWidth;
    if (w < 500) {
      $('#search').attr("placeholder", "Search");
    }
    if (w >= 500) {
      $('#search').attr("placeholder", "Dancing Queen, God's Plan...");
    }
    */
});
