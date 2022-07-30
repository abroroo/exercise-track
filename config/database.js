const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config()

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
  

  
const userSchemaEx = mongoose.Schema({
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
  
const userSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
});

const userNameModel = mongoose.model('userNameModel', userSchemaEx);
  
const User = mongoose.model('User', userSchema )

module.exports.User = User;

module.exports.userNameModel = userNameModel;