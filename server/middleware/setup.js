const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const store = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let setup = (app, config) => {
    return new Promise(async (resolve, reject) => {
        await db(config);
        console.log('🌱   connected to the database!');

        let sessionStore = await createStore(config);
        console.log('🌱   connected to the session store');

        await configureExpress(app, config, sessionStore);
        console.log('🌱   added express middleware');

        require('./passport')();
        console.log('🌱   added passport');

        resolve();
    });
}

let db = (config) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(`mongodb+srv://${config.username}:${config.password}@${config.url}?retryWrites=true&w=majority`);

        const db = mongoose.connection;

        db.on('error', (err) => {
            console.error('connection error:', err);
            reject(err);
        });

        db.once('open', function() {
            resolve();
        });
    });
}

let createStore = (config) => {
    return new Promise((resolve, reject) => {
        let options = {
          uri: `mongodb+srv://${config.username}:${config.password}@${config.url}?retryWrites=true&w=majority`,
          collection: 'sessions'
        };

        var sessionStore = new store(options);

        resolve(sessionStore);
    });
}

let configureExpress = (app, config, store) => {
    app.use(helmet());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cors());
    app.use(compression());

    app.use(express.static('build'));

    app.use(session({
        name: 'databanksy',
        genid: (req) => { return uuid() },
        secret: config.secret,
        store: store,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = setup;
