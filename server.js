// server.js
// where your node app starts

// init project
require('dotenv').config()
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/visuals", function (request, response) {
  response.sendFile(__dirname + '/views/visuals.html');
});

//-------------------------------------------------------------//

// init Spotify API wrapper
var SpotifyWebApi = require('spotify-web-api-node');

// Replace with your redirect URI, required scopes, and show_dialog preference
var isProd = process.env.NODE_ENV == "production";
var redirectUri = (isProd ? 'https://embellist.herokuapp.com' : 'http://localhost:3000') + "/callback";
var scopes = ["streaming", "user-read-birthdate", "user-read-email", "user-read-private", "user-modify-playback-state", "user-read-playback-state",
              "playlist-modify-public", "playlist-read-private", "playlist-modify-private"];
var showDialog = true;

// The API object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_ID,
  clientSecret : process.env.SPOTIFY_SECRET,
  redirectUri : redirectUri
});

app.get("/authorize", function (request, response) {
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, showDialog);
  response.send(authorizeURL);
});

// Exchange Authorization Code for an Access Token
app.get("/callback", function (request, response) {
  var authorizationCode = request.query.code;

  spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    response.redirect(`/#access_token=${data.body['access_token']}&refresh_token=${data.body['refresh_token']}&expires_in=${data.body['expires_in']}`)
  }, function(err) {
    console.log('Something went wrong when retrieving the access token!', err.message);
  });
});

app.get("/logout", function (request, response) {
  response.redirect('/');
});

app.get('/me', function(request, response) {
  var loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(request.headers['authorization'].split(' ')[1]);

  loggedInSpotifyApi.getMe()
    .then(function(data) {
      response.send(data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

app.get('/playlists', function(request, response) {
  var loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(request.headers['authorization'].split(' ')[1]);

  loggedInSpotifyApi.getUserPlaylists()
    .then(function(data) {
      response.send(data.body);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});



//-------------------------------------------------------------//

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
