const router = require('express').Router();
const userNameModel = require('../db-models/appModel');

const oauthCheck = (req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/')
    }
}




router.get("/api/users", oauthCheck, async (req, res) => {
    let allUsers = await userNameModel.find({})
  
    res.render("user/getuser.pug", { user: req.user,
      allUsers
    })
  })
  
  


  
  
  router.get('/api/users/:_id/logs', oauthCheck, (req, res) => {
    let queryId = req.params._id;
    let from = req.query.from;
    let to = req.query.to;
    let limit = +req.query.limit;
  
    userNameModel.findById({
      _id: queryId
    }, (err, data) => {
      if (err) console.error(err)

      console.log("this is data: " + data)

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
        user: req.user,
        "username": data.username,
        "count": count,
        "_id": queryId,
        "log": log
      })
    })
  })




  module.exports = router;