const express = require('express');
const router = express.Router();
const userNameModel = require('../models/models');
const dotenv = require("dotenv");
dotenv.config('../.env')






/* GET home page. */




router.post('/api/users', (req, res) => {
  
  let inputUsername = req.body.username;

  let User = new userNameModel({
    username: inputUsername
  })
   

  User.save((err, savedData) => {
    if (err) console.error(err)
   
    console.log("New username created");
    res.render("user/postuser.pug", {
      "username": inputUsername,
      "_id": savedData._id
    })

  })
})

router.get("/api/users", async (req, res) => {
  let allUsers = await userNameModel.find({})

  res.render("user/getuser.pug", {
    allUsers
  })
})


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


router.get('/api/users/:_id/logs', (req, res) => {
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
