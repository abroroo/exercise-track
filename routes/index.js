const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const router = express.Router(); 
// const User = mongoose.model('User');
const userNameModel = require('../config/database').userNameModel;
const User = require('../config/database').User;
const passport = require('passport');
const utils = require('../lib/utils');



/**
 * POST HTTP
 */


// SIGN UP
router.post('/register', function(req, res, next){

  const saltHash = utils.genPassword(req.body.password);

console.log("req.body.password is: " + req.body.password)
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt
  })

  newUser.save()
      .then((user) => {
        
          const jwt = utils.issueJWT(user);
          // req.headers.Authorization = jwt.token;
          if (jwt){
            req.headers["Authorization"] = `${jwt.token}`
          }   

          console.log("req.headers in /register: " + JSON.stringify(req.headers))
         
          // res.cookie("token", jwt.token, { maxAge: jwt.expires * 1000 })
          // res.redirect("/")
          // res.header({success: true, token: jwt.token, expiresIn: jwt.expires})
          res.redirect('/login')
          // console.log(req.headers)
      })
      .catch(err => next(err))
});


// LOGIN

router.post('/login', function(req, res, next){

  User.findOne({username: req.body.username})
      .then((user) => {
          if(!user) {
              res.status(401).json({success: false, msg: "Could not find user "})
          }
          // validate the user 
          const isValid = utils.validPassword(req.body.password, user.hash, user.salt)

    
          if(isValid) {
            // issue a JWT
            const jwt = utils.issueJWT(user);

            if (jwt){
              req.headers["Authorization"] = `${jwt.token}`
          
          }           
            console.log("req.headers in /login: " + JSON.stringify(req.headers))
            res.redirect("/")

          } else {
              res.status(401).json({success: false, msg: "you entered the wrong password"})
          }
      })
      .catch(err => next(err))

});

// CREATE USER
router.post('/api/users', (req, res) => {
  
  let inputUsername = req.body.username;

  let UserExercise = new userNameModel({
    username: inputUsername
  })
   

  UserExercise.save((err, savedData) => {
    if (err) console.error(err)
   
    console.log("New username created");
    res.render("user/postuser.pug", {
      "username": inputUsername,
      "_id": savedData._id
    })

  })
})


// CREATE EXERCISE FOR THE USER
router.post('/api/users/:_id/exercises', (req, res, next) => {
 
  let formDesc = req.body.description;
  let formDur = req.body.duration;
  let formDate = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();
  let formId = req.params._id;

  const logObj = {
    description: formDesc,
    duration: parseInt(formDur),
    date: formDate
  }

  userNameModel.findByIdAndUpdate({_id: formId}, {
    $push: {
      log: logObj
    }
  }, {
    new: true
  }, (err, data) => {
    if (err) console.error(err)
    
    let responseObj = {
      "username": data.username,
      "description": logObj.description,
      "duration": parseInt(logObj.duration),
      "date": logObj.date,
      "_id": formId  
    }

    res.render("exercise/postexercise", {
      responseObj})

  })


})

// LOGOUT
router.post('/logout', (req, res) => {
  console.log(req.headers)

  req.logout(function(err) {
    if (err) { c
      console.log(err) 
      return next(err); }
    // console.log(req.headers)
     
  });
  res.redirect('/');
})



/***
 * GET HTTP
 */
/*
 router.get('/logout', (req, res, next) => {
  console.log(req.headers.authorization)
  req.logout(function(err) {
    if (err) { return next(err); }
    console.log(req.headers.authorization)
    res.redirect('/');
  });
});
*/

router.get('/login', (req, res, next) => {
  res.render('login/login.pug');
  next()
})

router.get('/register', (req, res, next) => {
  res.render('register/register.pug')
  next()
})


// THIS PROTECTED GET REQUEST



router.get("/api/users", passport.authenticate('jwt', {session: false}), async (req, res) => {

  console.log("req.headers in protected /api/users: " + JSON.stringify(req.headers))
  let allUsers = await userNameModel.find({})

  res.render("user/getuser.pug", {
    allUsers
  })
})


// PROTECTED LOGS
router.get('/api/users/:_id/logs', passport.authenticate('jwt', {session: false}),  (req, res) => {
  let queryId = req.params._id;
  let from = req.query.from;
  let to = req.query.to;
  let limit = +req.query.limit;

  userNameModel.findById({
    _id: queryId
  }, (err, data) => {
    if (err) console.error(err)

    let log = data.log.map((a) => {
      return {
        description: a.description,
        duration: parseInt(a.duration),
        date: new Date(a.date).toDateString()

      }
    })

    if (from) {
      const fromDate = new Date(from)
      log = log.filter(a => new Date(a.date) >= fromDate)
    }
    if (to) {
      const toDate = new Date(to)
      log = log.filter(a => new Date(a.date) <= toDate)
    }
    if (limit) {
      log = log.slice(0, limit)
    }

    let count = log.length;

    res.render("logs/getlogs",{
      "username": data.username,
      "count": count,
      "_id": queryId,
      "log": log
    })
  })
})


module.exports = router;
