const passport = require('passport');
const User = require('../mongo/user_model');
const UserService = require('../mongo/user_functions');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

let findById = function(id) {
    return new Promise(async (resolve, reject) => {
        let user = (await User.findById(id)).toObject();

        resolve(user);
    });
}

let login = function(username, password) {
    return new Promise(async (resolve, reject) => {
        let user = await User.findOne({username: username});

        if (!user.g_id) {
          user.comparePassword(password, (err, isMatch) => {
              if (err) reject(err);

              resolve({user: user, isMatch: isMatch});
          });
        } else {
          reject({user: null, isMatch: false});
        }
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

    passport.use(new GoogleStrategy({
      clientID: '903452733140-nbsc418cdr3afi46bnnbiruhsbg08tc8.apps.googleusercontent.com',
      clientSecret: 'AmgPrkg4jQYK97k9Sz6GACoM',
      callbackURL: '/auth/google/callback'
    }, async (token, refreshToken, profile, done) => {
      // TODO -- CHECK IF USER EXISTS, CREATE NEW USER IF THEY DO NOT EXIST
      try {
          let user = await UserService.getUserByGoogleId(profile.id);

          if (!user) {
            user = await UserService.createUser({
              g_id: profile.id,
              displayName: profile.displayName,
              email: profile._json.email,
              password: profile.id
            })
          }

          return done(null, user);
      } catch(err) {
          console.error(err);
          return done(err);
      }
    }));
}

module.exports = res;
