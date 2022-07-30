const mongoose = require('mongoose');


const AuthUserSchema = mongoose.Schema({
    username: String,
    googleID: String
  })
  

  const AuthUserModel = mongoose.model('OAuthUser', AuthUserSchema );
  

  module.exports = AuthUserModel;