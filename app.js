//------------------ REQUIRES



const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
})
const express = require('express');
const path = require('path');
const cors = require('cors')
const mongodb = require('mongodb');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser')
const app = express();
const passportSetup = require('./config/passport-setup'); // just need to be required
const oauthRoutes = require('./routes/oauth-routes');
const appRoutes = require('./routes/app-routes');
const protectedRoutes = require('./routes/protected-routes');
const session = require('express-session');
const keys = require('./config/keys');
const passport = require('passport');




// ---------------APP.USE()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views','./views');


const expiryDate = new Date(Date.now() + (60 * 60 * 1000)) // 1 hour

app.use(session({
 
  saveUninitialized: true,
  resave: false,
  secret: [keys.session.secretKey],
  maxAge: 60 * 60 * 1000
}))


// initialize passport
app.use(passport.initialize());
app.use(passport.session());



app.use('/', appRoutes);
app.use('/', protectedRoutes);
app.use('/auth', oauthRoutes);



// -----------------DEBUGGING LOGS




app.use(({ method, url, query, params, body }, res, next) => {
  console.log('>>> ', method, url);
  console.log(' QUERY:', query);
  console.log(' PRAMS:', params);
  console.log('  BODY:', body);
  const _json = res.json;
  res.json = function (data) {
    console.log(' RESULT:', JSON.stringify(data, null, 2));
    return _json.call(this, data);
  };
  console.log(' ----------------------------');
  next();
});






// ----------------DATABASE------


// CONNECTION 

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



/// --------------- ROUTES


// HOME 


app.get('/', (req, res) => {
   console.log("req.user in homepage:  " + req.user)
   console.log("req.session.passport in homepage: " + req.session.passport)
      res.render('index', {user: req.user});
     
 });


 app.use((req, res) => {
  res.render('./nav/nav')
})







module.exports = app