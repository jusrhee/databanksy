const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const artworkController = require('./controllers/artworks');
const artistController = require('./controllers/artists');
const query = require('./sql/helpers.js');

let start = async () => {    
    routes();

    app.listen(3000, () => {
        console.log(`🌱   api server listening on port 3000!`);
    });
}

let routes = () => {
    app.get('/api/artworks', artworkController.get_artworks);
    app.get('/api/artworks/associated', artworkController.get_associated_artworks);

    app.get('/api/artist', artistController.get_artist);
}

start();
