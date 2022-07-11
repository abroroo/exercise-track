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
    username: String,
},{versionKey: false}) // not to create _v in monogoDB collection 

const exerciseSchema = mongoose.Schema({
    username: String,
    description: String,
    duration: Number,
    date: Date,
}, {versionKey: false})

let userNameModel = mongoose.model('userNameModel', userSchema)
let exerciseTrackModel = mongoose.model('exerciseTrackModel', exerciseSchema);


let responseUserObj = new userNameModel();

app.post('/api/users', (req, res) => {
    
let inputUsername = req.body.username;
  
userNameModel.findOne({username: inputUsername}, (err, data) => {
  if (err) console.log(err)
  if (data) {
    console.log("Data has already been submitted")
    res.json(responseUserObj)
  } else {
    responseUserObj.username = inputUsername;
    responseUserObj.save((err, savedData) => {
      if (err) console.error(err)
      console.log("New username created");
      res.json(responseUserObj)
    })
  }
})
    
})

let responseExerciseObj = new exerciseTrackModel(); 

app.post('/api/users/:_id/exercises', (req, res, next) => {

    let queryId = req.body.id;
    let formDesc = req.body.description;
    let formDur = req.body.duration;
    let formDate = req.body.date;
   

    userNameModel.findOne({_id: queryId}, (err, data) => {
      if (err) console.error(err)
      if (data) {
        console.log(`username with this id: ${queryId}  exists`)

        exerciseTrackModel.findOne({_id: queryId}, (err, foundE) => {
          if (err) console.error(err)
          if (!foundE) {
            responseExerciseObj._id = queryId
          responseExerciseObj.username = data.username; 
          responseExerciseObj.description = formDesc;
          responseExerciseObj.duration = formDur;
          responseExerciseObj.date = formDate;

          responseExerciseObj.save().then((err, result) => {
            if (err) console.error(err)
            console.log("new responseExerciseObj is created")
            res.json(responseExerciseObj);
          }) 
          } res.json(foundE);
        })
          
      } else {
        res.json(`User with id: <${queryId}> doesn't exist!`)
      }
    })
    // next()
})


app.get("/api/users", async (req, res) => {
  let allUsers = await userNameModel.find({})

  res.json(allUsers)
})





module.exports = app





