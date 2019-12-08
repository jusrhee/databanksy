const passport = require('passport');
const User = require('../mongo/user_model');
const UserService = require('../mongo/user_functions');
const LocalStrategy = require('passport-local').Strategy;

let findById = function(id) {
    return new Promise(async (resolve, reject) => {
        let user = (await User.findById(id)).toObject();

        resolve(user);
    });
}

let login = function(username, password) {
    return new Promise(async (resolve, reject) => {
        let user = await User.findOne({username: username});

        user.comparePassword(password, (err, isMatch) => {
            if (err) reject(err);

            resolve({user: user, isMatch: isMatch});
        });
    });
}

let res = (app) => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (userId, done) => {
        try {
            let user = await findById(userId);
            done(null, user);
        } catch(err) {
            done(err);
        }
    });

    passport.use(new LocalStrategy(async (username, password, done) => {
      try {
          let result = await login(username, password);

          if (!result.user) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          if (!result.isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, result.user);
      } catch(err) {
          console.error(err);
          return done(err);
      }
    }))
}

module.exports = res;
