// client-side js
function refreshPage() {
  window.location.reload();
}

$(function() {
  var access_token, track_id;

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
  if (hash.track_id) {
    Cookies.set('track_id', hash.track_id);
    window.location.href = '/visuals';
  }

  access_token = Cookies.get('access_token');
  track_id = Cookies.get('track_id');
  if (access_token && track_id) {
    // Logged in
    $('#visuals-view').show();
  }
  else {
    // Not logged in
    window.location.href = '/';
  }
});
