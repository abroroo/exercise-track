const fs = require('fs');
const path = require('path');
// const User = require('mongoose').model('User');
const User = require('../config/database').User;
const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


// this is standard options to pass for JwtStrategy module of passport-jwt to verify the jwt token
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};
// here JwtStratgy checks the toekn(issued in /login route) for verification, then lets find user info from database , if found return user data, which passportJs will attach to req.user express obj 
const strategy = new Strategy(options, (payload, done) => {
    console.log("strategy is used")
    console.log("Strategy payload.sub: " + payload.sub)
    
    User.findOne({_id: payload.sub})
        .then((user) => {
            if(user) {
                console.log("if inside strategy")
                return done(null, user)
            } else {
                console.log('else inside strategy')
                return done(null, false)
            }
        })
        .catch((err) => done(err, null))
});


module.exports.strategy = strategy;

// we should tell passport.js use above strategy
/*module.exports = (passport) => {
    passport.use(strategy)
}*/