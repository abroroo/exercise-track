const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config('../.env')

const uri = process.env.MONGO_URI
const connection = mongoose.connection;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
connection.on('error', console.error.bind(console, "connection error"))
connection.once('open', async () => {
 console.log('MongoDB database connection has been established successfully')
})



