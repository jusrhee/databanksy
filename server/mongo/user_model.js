const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
const numberRegex = /\d/;
const letterRegex = /[a-zA-Z]/; 

let emailValidator = (v) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return new Promise((resolve, reject) => {
        if (emailRegex.test(v)) {
            resolve(v);
        } else {
            reject(JSON.stringify({code: 0, message: "Not a valid email address"}));
        }
    });
}

let UserSchema = new Schema({
    g_id: String,
    displayName: String,
    username: {
        type: String,
        index: { unique: true },
        maxlength: 40
    },
    email: {
        type: String,
        required: true,
        validate: { validator: emailValidator }
    },
    password: { type: String },
    saved: [{ type: String }],
    deleted: { type: Boolean, default: false },
    timeDeleted: Date
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        checkPassword(user.password).then(() => {
            bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                if (err) {
                    return next(err);
                }

                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) return next(err);

                    // override the cleartext password with the hashed one
                    user.password = hash;
                    next();
                });
            });
        }).catch(e => next(e));
    } else {
        next();
    }
});

let checkPassword = (pw) => {
    return new Promise((resolve, reject) => {
        if (pw.length < 8) {
            reject({code: 2, message: "Minimum must be at least 8 characters"});
        }

        resolve();
    });
}

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

module.exports = mongoose.model('GeneralUser', UserSchema);