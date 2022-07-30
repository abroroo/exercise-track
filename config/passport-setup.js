const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const AuthUserModel = require('../db-models/authModel');

// store to the cookie
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// retrieve from the cookie,   it will attach result to the route's req handler
passport.deserializeUser((id, done) => {
    console.log("id in deserilize:  " + id)
    AuthUserModel.findById(id).then((user) => {
        console.log("user in deserilize:  " + user)
        done(null, user)
    })
})



passport.use(
    new GoogleStrategy ({
        //options
        callbackURL: '/auth/google/redirect',
        clientID : keys.google.clientID,
        clientSecret: keys.google.clientSecret

    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in db

        AuthUserModel.findOne({googleID: profile.id}).then((foundUser) => {
            if(foundUser) {
                // send foundUser to serialization
                done(null, foundUser) 
            } else {
                new AuthUserModel ({
                    username: profile.displayName,
                    googleID: profile.id
                }).save().then((newUser) => {
                    // send newUser to serialization
                    done(null, newUser) 
                })
            }
        })

        


    })
)

