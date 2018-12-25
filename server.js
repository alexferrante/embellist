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

var isProd = process.env.NODE_ENV == "production";
var redirectUri = ('http://localhost:3000') + "/callback";
var scopes = ["user-read-birthdate", "user-read-email", "user-read-private", "user-read-playback-state",
              "playlist-modify-public", "playlist-read-private", "playlist-modify-private", ];
var showDialog = true;

// API object 
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

  loggedInSpotifyApi.getMe()
    .then(data => {
      loggedInSpotifyApi.getUserPlaylists(data.body.id, {limit : 50}) //maximum limit is 50
        .then(function(data) {
          response.send(data.body);
        }).catch(error => {
          console.log('Error getting playlists', error);
          response.status(error.statusCode).send(error);
        });
    })
    .catch(error => {
      response.status(error.statusCode).send(error);
    });  
});


app.get('/playlistTracks', function(request, response) {
  var loggedInSpotifyApi = new SpotifyWebApi();
  loggedInSpotifyApi.setAccessToken(request.headers['authorization'].split(' ')[1]);

  let query = request.query.playlist_id; 

  loggedInSpotifyApi.getPlaylistTracks(query, {limit: 9})
    .then(function(data) {
      response.send(data.body);
    }, function(err) {
      console.log('Something went wrong fetching playlist tracks', err);
    });
});

app.get('/pla')

//-------------------------------------------------------------//

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
