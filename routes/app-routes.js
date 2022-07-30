const router = require('express').Router();
const userNameModel = require('../db-models/appModel')


// POST 



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
  


  
  
  

  module.exports = router;