const express = require('express');
const app = express();

// helpers
const query = require('./sql/helpers.js');

// middleware
const authorizer = require('./middleware/authorizer');
const setup = require('./middleware/setup');

// controllers
const artworkController = require('./controllers/artworks');
const artistController = require('./controllers/artists');
const userController = require('./controllers/user');

let start = async () => {    
    let store = await setup(app, {
        username: 'root',
        password: 'djkhaled',
        url: 'cluster0-xnjlu.gcp.mongodb.net/databanksy',
        secret: 'banksyboys'
    });

    routes(store);

    app.listen(3000, () => {
        console.log(`🌱   api server listening on port 3000!`);
    });
}

let routes = (store) => {
    app.get('/api/user/saved', authorizer.verify_logged_in, userController.user_artwork_saved_get);
    app.post('/api/user/login', (req, res) => userController.user_login_post(req, res, store));
    app.post('/api/user/logout', userController.user_logout_post);
    app.post('/api/user/artwork/add', authorizer.verify_logged_in, userController.user_artwork_add_post);

    app.get('/api/artworks', artworkController.get_artworks);
    app.get('/api/artworks/associated', authorizer.verify_logged_in, artworkController.get_associated_artworks);

    app.get('/api/artist', authorizer.verify_logged_in, artistController.get_artist);
}

start();