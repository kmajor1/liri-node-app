// bring in CL arguments 
var command = process.argv[2];
var usrQuery = process.argv[3]; 

// required modules 
require("dotenv").config();
var keys = require('./keys');
var Spotify = require('node-spotify-api');
const fs = require('fs'); 
const moment = require('moment');
const axios = require('axios');

// movieThis function 

function movieThis (q) {
    console.log('Searching for your movie...');
    var url ='http://www.omdbapi.com/?apikey=trilogy&t='+ usrQuery || q +'&type=movie'; 
axios.default
    .get(url)
    .then(function (res) {
        console.log(res.data.Title);
        console.log(res.data.Year); 
        console.log((res.data.Ratings[0] ? res.data.Ratings[0].Source : 'No IMDB Review!') + ' ' + (res.data.Ratings[0] ? res.data.Ratings[0].Value : '')); 
        console.log((res.data.Ratings[1] ? res.data.Ratings[1].Source : 'No Rotten Tomatoes Review!') + ' ' + (res.data.Ratings[1] ? res.data.Ratings[1].Value : '')); 
        console.log(res.data.Country);
        console.log(res.data.Language);
        console.log(res.data.Plot); 
        console.log(res.data.Actors); 
    })
    .catch(function (err) {
        console.log(err); 
    })
    
}

// spotify function 
function spotifyThis (q) {
    console.log('Searching for your song...');
    var spotify = new Spotify(keys.spotify);
    spotify.search({type: "track", query: q || usrQuery, limit: 1}, function(err,data){
    if (err) {
        console.log(err);
    }
    var song = data.tracks.items[0];
    console.log(song.name);
    console.log(song.artists[0].name); 
    console.log(song.album.name); 
    console.log(song.preview_url ? song.preview_url : 'No Preview Available');
})
}

// concert this function 
function concertThis (q) {
    console.log('Searching for an upcoming concert...')
    var app_id = keys.concert; 
    var artist = q || usrQuery; 
    var urlString = 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id='+app_id;
    axios.default
    .get(urlString)
    .then(function(res) {
        var venueDate = res.data[0]; 
        console.log(venueDate.venue.name);
        console.log(venueDate.venue.city + ' ' + venueDate.venue.country);
        var dateFormatted = moment(venueDate.datetime).format('MM/DD/YYYY');
        console.log(dateFormatted);

    })
}


if (command === 'spotify-this') {
    process.argv[3] ? spotifyThis() : spotifyThis('The Sign Ace of Base'); 
    
    
}
else if (command === 'movie-this') {
    process.argv[3] ? movieThis() : movieThis('Mr. Nobody');
    
} 
else if (command === 'concert-this') {
    concertThis();
}
// do what I say function 
// renamed to simon-says for easier usage 
else if (command === 'simon-says') {
    fs.readFile('random.txt','utf8',function(err,data) {
        var dataArray = data.split(','); 
        var c = dataArray[0]; 
        var q = dataArray[1]; 
        if (c === 'spotify-this') {
            spotifyThis(q); 
        }
        else if (c === 'movie-this') {
            console.log('Calling Movie Search...');
            movieThis(q);
        }
        else if (c === 'concert-this') {
            console.log('Calling concert search...');
            concertThis(q); 
        }
        
    })
}

