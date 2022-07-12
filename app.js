const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env"
})
const express = require('express');
const path = require('path');
const cors = require('cors')
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')



const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));


const uri = process.env.MONGO_URI
const connection = mongoose.connection;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
connection.on('error', console.error.bind(console, "connection error"))
connection.once('open', () => {
  console.log('MongoDB database connection has been established successfully')
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  log: [{
    _id: false,
    date: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],

}, {
  versionKey: false
}) // not to create _v in monogoDB collection 


let userNameModel = mongoose.model('userNameModel', userSchema)

let User = new userNameModel()

app.post('/api/users', (req, res) => {

  let inputUsername = req.body.username;

  User.username = inputUsername

  User.save((err, savedData) => {
    if (err) console.error(err)
    console.log("New username created");
    res.send({
      "username": inputUsername,
      "_id": savedData._id
    })
  })
})

app.get("/api/users", async (req, res) => {
  let allUsers = await userNameModel.find({})

  res.json(allUsers)
})


app.post('/api/users/:_id/exercises', (req, res, next) => {

  let formId = req.body.id;
  let formDesc = req.body.description;
  let formDur = req.body.duration;
  let formDate = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();


  const logObj = {
    description: formDesc,
    duration: formDur,
    date: formDate
  }

  userNameModel.findByIdAndUpdate(formId, {
    $push: {
      log: logObj
    }
  }, {
    new: true
  }, (err, result) => {
    if (err) console.error(err)
console.log(result)
    
    let responseObj = {
      "_id": formId,
      "username": User.username,
      "date": logObj.date,
      "duration": parseInt(logObj.duration),
      "description": logObj.description
    }

    res.json(responseObj)

  })


})


app.get('/api/users/:_id/logs', (req, res) => {
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
      log = log.filter(exe => new Date(exe.date) >= fromDate)
    }
    if (to) {
      const toDate = new Date(to)
      log = log.filter(exe => new Date(exe.date) <= toDate)
    }
    if (limit) {
      log = log.slice(0, limit)
    }
    console.log("This is log " + log)

    let count = log.length;

    res.send({
      "_id": queryId,
      "username": data.username,
      "count": count,
      "log": log
    })
  })
})






module.exports = app