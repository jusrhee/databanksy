const UserService = require('../mongo/user_functions');
const passport = require('passport');
const query = require('../sql/helpers.js');

module.exports.user_get = async (req, res) => {
    try {
        let user = await UserService.getUser(req.user._id);

        res.status(200).json(user);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

module.exports.user_artwork_saved_get = async (req, res) => {
    try {
        let saved = await UserService.getUserSaved(req.user._id);

        if (req.query.populate && saved.length > 0) {
            saved = await query.populate_artworks(saved);
        }

        res.status(200).json(saved);
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

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

module.exports.user_create_post = async (req, res, store) => {
    if (!req.body.username) {
        return res.status(400).send('username required');
    } else if (!req.body.email) {
        return res.status(400).send('email required');
    } else if (!req.body.password) {
        return res.status(400).send('password required');
    } 

    try {
        let exists = await UserService.doesUsernameExist(req.body.username);

        if (exists) {
            return res.status(400).json({code: 1, message: 'Username already taken'});
        } else {
            let user = await UserService.createUser({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });

            passport.authenticate('local', (err, user, info) => {
                req.login(user, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal server error'); // should not occur
                    }

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
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

module.exports.user_logout_post = async (req, res) => {
    try {
        req.logout();
        res.status(200).send('Successful');
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

module.exports.user_artwork_add_post = async (req, res) => {
    if (!req.body.artwork_id) {
        return res.status(400).send('artwork_id required');
    } 

    try {
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

module.exports.user_artwork_remove_post = async (req, res) => {
    if (!req.body.artwork_id) {
        return res.status(400).send('artwork_id required');
    } 

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