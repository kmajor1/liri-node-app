// bring in CL arguments 
var command = process.argv[2];
var usrQuery = process.argv[3]; 



// require modules 
require("dotenv").config();
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var movies = require('axios');
const fs = require('fs'); 

// functions to be used by below ifs 
function movieThis (q) {
    var url ='http://www.omdbapi.com/?apikey=trilogy&t='+ q || usrQuery +'&type=movie'; 
movies.default
    .get(url)
    .then(function (res) {
        console.log(res.data.Title);
        console.log(res.data.Year); 
        console.log(res.data.Ratings[0].Source +' ' +res.data.Ratings[0].Value); 
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


if (command === 'spotify-this-song') {
    spotifyThis();
}
else if (command === 'movie-this') {
    movieThis(); 
    
}
else if (command === 'simon-says') {
    fs.readFile('random.txt','utf8',function(err,data) {
        var dataArray = data.split(','); 
        var c = dataArray[0]; 
        var q = dataArray[1]; 
        if (c === 'spotify-this-song') {
            spotifyThis(q); 
        }
        else if (c === 'movie-this') {
            console.log('Calling Movie Search...')
            movieThis(q);
        }
        
    })
}

