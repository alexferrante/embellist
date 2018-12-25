// client-side js
var access_token;

$('#login').click(function() {
  $.get('/authorize', function(data) {
    window.location = data;
  });
});

$('#logout').click(function() {
  Cookies.remove('access_token');
  Cookies.remove('display_name');
  Cookies.remove('user_image');
  Cookies.remove('playlist_id');
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
  var user_image = Cookies.get("user_image");

  if (user_image) {
    $('#user').attr("src", user_image);
    $('#user').attr("width", "40px");
    $('#user').css("border-radius", "50%");
    $('#user').css("float", "left");
  }

  if (display_name) {
    $('#displayName').text(display_name);
  }
  
  if (!display_name && !user_image) {
    $.get({url: '/me', headers: {"Authorization": `Bearer ${access_token}`}}, function(data) {
      if (data.images.length > 0) {
        Cookies.set("user_image", data.images[0].url);
        $('#user').attr("src", data.images[0].url);
        $('#user').attr("width", "40px");
        $('#user').css("border-radius", "50%");
        $('#user').css("float", "left");
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
          window.location.href = `/visuals/#playlist_id=${playlist.id}`;
        });
      });

      var cover = $('<img>');
      if (playlist.images.length > 0) {
        cover.attr("src", playlist.images[0].url);
      } else {
        cover.attr("src", 'assets/spotify_icon.png');
      }
      cover.appendTo(container);

      var playlistName = $('<h5 style="font-weight: 300;">' + playlist.name + '</h5>');
      playlistName.appendTo(container);

      container.appendTo('#searchResults');
    });
    $('#searchResults').fadeIn(500);
  });
}


