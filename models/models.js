const mongoose = require('mongoose');



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
  
  
  const userNameModel = mongoose.model('userNameModel', userSchema)


  module.exports = userNameModel;