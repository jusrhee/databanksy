const UserService = require('../mongo/user_functions');
const passport = require('passport');
const query = require('../sql/helpers.js');

/**
 * Retrieves the user information
 */
module.exports.user_get = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

/**
 * Retrieves the saved artwork for a user
 */
module.exports.user_artwork_saved_get = async (req, res) => {
    try {
        let saved = (await UserService.getUserSaved(req.user._id)).reverse();

        // if populate, join on the SQL data
        if (req.query.populate && saved.length > 0) {
            saved = (await query.populate_artworks(saved)).reverse();
        }

        res.status(200).json(saved);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

/**
 * Logs the user into the platform, given a username and password.
 */
module.exports.user_login_post = async (req, res, store) => {
    if (!req.body.username) {
        return res.status(400).json({ code: 0, message: 'Username required' });
    } else if (!req.body.password) {
        return res.status(400).json({ code: 1, message: 'Password required' });
    }

    try {
        let user = await UserService.getUserByUsername(req.body.username);

        if (!user) {
            return res.status(400).json({ code: 0, message: 'Username does not exist' });
        }

        // use local strategy
        passport.authenticate('local', (err, user, info) => {
            req.login(user, (err) => {
                if (err) return res.status(400).json({ code: 1, message: 'Wrong password' });

                // write the cookie manually
                store.get(req.session.id, (err, session) => {
                    if (err) console.error(err);

                    if (session) {
                        store.set(req.session.id, {
                            cookie: session.cookie,
                            passport: req.session.passport
                        });
                    }
                });

                res.status(200).send('Successful');
            });
        })(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

/**
 * Redirects the user to the Google login page, and then redirects a user 
 * to our callback function.  
 */
module.exports.user_google_cred_get = async (req, res, store) => {
    try {
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

/**
 * Logs a user in using their Google credentials.  
 */
module.exports.user_google_login_get = async (req, res, store) => {
    try {
        passport.authenticate('google', (err, user, info) => {
            req.login(user, (err) => {
                if (err) return res.status(400).json({ code: 1, message: 'Wrong password' });

                // write the cookie manually
                store.get(req.session.id, (err, session) => {
                    if (err) console.error(err);

                    if (session) {
                        store.set(req.session.id, {
                            cookie: session.cookie,
                            passport: req.session.passport
                        }, () => {
                            res.redirect('/app');
                        });
                    }
                });
            });
        })(req, res);

    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

/**
 * Creates a new user based on username, email, and password. 
 */
module.exports.user_create_post = async (req, res, store) => {
    if (!req.body.username) {
        return res.status(400).send('username required');
    } else if (!req.body.email) {
        return res.status(400).send('email required');
    } else if (!req.body.password) {
        return res.status(400).send('password required');
    } 

    try {
        // check if the user exists in the database
        let exists = await UserService.doesUsernameExist(req.body.username);

        if (exists) {
            return res.status(400).json({code: 1, message: 'Username already taken'});
        } else {
            // create the user if they do not exist
            let user = await UserService.createUser({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });

            passport.authenticate('local', (err, user, info) => {
                req.login(user, (err) => {
                    if (err) throw err;

                    // write the cookie manually
                    store.get(req.session.id, (err, session) => {
                        if (err) console.error(err);

                        if (session) {
                            store.set(req.session.id, {
                                cookie: session.cookie,
                                passport: req.session.passport
                            });
                        }
                    });

                    res.status(200).send('Successful');
                });
            })(req, res);
        }
    } catch (e) {
        if (e.code === 2) {
            res.status(400).json(e);
        } else if (e.errors) {
            if (e.errors.email) {
                res.status(400).json({code: 0, message: 'Invalid email address'});
            } else if (e.errors.username) {
                res.status(400).json({code: 1, message: 'Maximum username length is 40 characters'});
            } else if (e.errors.password) {
                res.status(400).json({code: 2, message: 'Invalid password'});
            } else {
                console.error(e);
                res.status(500).send('Internal server error');
            }
        } else {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    }
}

/**
 * Logs the user out of the platform. 
 */
module.exports.user_logout_post = async (req, res) => {
    try {
        req.logout();
        res.status(200).send('Successful');
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

/**
 * Adds an artwork to the set of saved artworks for a user. 
 */
module.exports.user_artwork_add_post = async (req, res) => {
    if (!req.body.artwork_id) {
        return res.status(400).send('artwork_id required');
    } 

    try {
        // check if the artwork exists
        let artwork_exists = await query.verify_artwork_exists(req.body.artwork_id);

        if (artwork_exists) {
            await UserService.addUserSaved(req.user._id, req.body.artwork_id);

            return res.status(200).send('Successful');
        } else {
            return res.status(400).send('artwork does not exist');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

/**
 * Removes an artwork from the set of saved artworks for a user. 
 */
module.exports.user_artwork_remove_post = async (req, res) => {
    if (!req.body.artwork_id) {
        return res.status(400).send('artwork_id required');
    } 

    // check if the artwork exists
    try {
        let artwork_exists = await query.verify_artwork_exists(req.body.artwork_id);

        if (artwork_exists) {
            await UserService.removeUserSaved(req.user._id, req.body.artwork_id);

            return res.status(200).send('Successful');
        } else {
            return res.status(400).send('artwork does not exist');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}