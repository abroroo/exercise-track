const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" })
const express = require('express');
const path = require('path');
const cors = require('cors')
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')



const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


const uri = process.env.MONGO_URI
const connection = mongoose.connection;

mongoose.connect(uri, {useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })
connection.on('error', console.error.bind(console, "connection error"))
connection.once('open', () => {
  console.log('MongoDB database connection has been established successfully')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})


const userSchema = mongoose.Schema({
  username: { type: String, required: true },
    log: [{
      _id: false,
      date: Date,
      duration: Number,
      description: String
    }],
    
},{versionKey: false}) // not to create _v in monogoDB collection 


let userNameModel = mongoose.model('userNameModel', userSchema)



app.post('/api/users', (req, res) => {
    
let inputUsername = req.body.username;
  
let responseUser = new userNameModel({
  username: `${inputUsername}`
})
    responseUser.save((err, savedData) => {
      if (err) console.error(err)
      console.log("New username created");
      res.send({
        "username" : inputUsername,
        "_id": savedData._id
      })
    })
})

app.get("/api/users", async (req, res) => {
  let allUsers = await userNameModel.find({})

  res.json(allUsers)
})


app.post('/api/users/:_id/exercises', (req, res, next) => {

    let queryId = req.body.id;
    let formDesc = req.body.description;
    let formDur = req.body.duration;
    let formDate = req.body.date || new Date().toDateString()
    // ? new Date(req.body.date).toDateString() : new Date().toDateString();
   

  const logObj = {
    description: formDesc,
    duration: formDur,
    date: formDate
  }

  userNameModel.findByIdAndUpdate(queryId, {$push:{log: logObj}}, {new: true}, (err, result) => {
    if (err) console.error(err)

    let responseObj = {
      "_id": queryId,
      "username": result.username,
      "date": logObj.date,
      "duration": logObj.duration,
      "description": logObj.description
    }

    res.json(responseObj)

  })

  //res.json(`User with id: <${queryId}> doesn't exist!`)
/*
    userNameModel.findOne({_id: queryId}, (err, data) => {
      if (err) console.error(err)
      if (data) {
        console.log(`username with this id: ${queryId}  exists`);

          responseUserObj.username = data.username; 
          responseUserObj.log.push({
            date: formDate,
            duration: formDur,
            description: formDesc
          });

          responseUserObj.save().then((err, result) => {
            if (err) console.error(err)
            console.log("new responseUserObj is created")
            res.json(responseUserObj);
          }) 
        } else {
        res.json(`User with id: <${queryId}> doesn't exist!`)
      }
    })
    // next()*/
})

app.get('/api/users/:_id/logs', (req, res) => {
  let queryId = req.params._id;

  userNameModel.findById({_id: queryId}, (err, data) => {
    if (err) console.error(err)

    let log = data.log.map((a) => {
      return {
        description: a.description,
        duration: a.duration,
        date: a.date

    }})

    console.log("This is log " + log)

    let count = log.length;

    res.send({
      "username": data.username,
      "count": count,
      "_id": queryId,
      "log": data.log
    })
  })
})






module.exports = app






