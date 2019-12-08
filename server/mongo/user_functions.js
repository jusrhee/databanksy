/**
 * User services for modifying the user model in the database. 
 * Only depends on User model found in ./user_model.js
 */

const mongoose = require('mongoose');
const User = require('./user_model');

module.exports.getUser = (user_id, select) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findById(user_id, select);

            resolve(user);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.createUser = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            // create and return the user object
            let user = new User(options);
            await user.save();

            let res = user.toObject();

            resolve(res);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.getUserByUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ username: username });

            resolve(user);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.doesUsernameExist = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ username: username });

            resolve(!!user);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.getUserSaved = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findById(user_id, 'saved');

            resolve(user.saved);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.addUserSaved = (user_id, artwork_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.updateOne({ _id: user_id }, {
                $push: { saved: artwork_id }
            });

            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.removeUserSaved = (user_id, artwork_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.updateOne({ _id: user_id }, {
                $pull: { saved: artwork_id }
            });

            resolve();
        } catch (e) {
            reject(e);
        }
    });
}