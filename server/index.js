const express = require("express");
const app = express();
const path = require('path');

const SpotifyWebApi = require('spotify-web-api-node');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Spotify API credentials
const spotifyApi = new SpotifyWebApi({
    clientId: '8348f2061ec948dbb1fc159d95130d84',
    clientSecret: '2d24a48406fe40dbbca35718b7d00f1b',
    redirectUri: 'http://localhost:3000/',
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Spotify API authentication endpoint
app.get('/login', (req, res) => {
    const authorizeURL = spotifyApi.createAuthorizeURL(['user-read-private', 'user-read-email'], 'state', true);
    res.redirect(authorizeURL);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});