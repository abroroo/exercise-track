const router = require('express').Router();
const passport = require('passport');
const AuthUserModel = require('../db-models/authModel');

// auth login

router.get('/login', (req, res) => {
    res.render('auth/login')
})

// auth logout

router.get('/logout', (req, res, next) => {
    // handle with passport.js
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      })
})


// login with google

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

// callback route for user to redirect to

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log("req.user in google/redirect " + req.user)
    console.log("req.session.passport in google/redirect: " + req.session.passport)
   res.redirect('/');
})




module.exports = router;
