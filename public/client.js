// client-side js

function refreshPage() {
  window.location.reload();
}

// passsing data to separate view
$(function() {
  var access_token, playlist_id;

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

  if (hash.playlist_id) {
    Cookies.set('playlist_id', hash.playlist_id);
    window.location.href = '/visuals';
  }

  access_token = Cookies.get('access_token');
  playlist_id = Cookies.get('playlist_id');

  if (access_token && playlist_id) {
    // logged in
    $('#view').show();
  }
  else {
    // not logged in
    window.location.href = '/';
  }
});
