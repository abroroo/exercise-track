const express = require('express');
const path = require('path');
const cors = require('cors')
const passport = require('passport');
const strategy = require('./config/passport').strategy;
const app = express();
app.use(cors())

// require('./config/passport')(passport);

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');

app.set('views','./views');

// passport.use(strategy)

app.use(({ method, url, query, params, body }, res, next) => {
  console.log('>>> ', method, url);
  console.log(' QUERY:', query);
  console.log(' PRAMS:', params);
  console.log('  BODY:', body);
  const _json = res.json;
  res.json = function (data) {
    console.log(' RESLT:', JSON.stringify(data, null, 2));
    return _json.call(this, data);
  };
  console.log(' ----------------------------');
  next();
});


require('./config/database');
// Must first load the models


app.use(passport.initialize());
passport.use(strategy);
app.use(cors())

app.use(require('./routes'));

// console.log(passport.authenticate('jwt', {session: false}))


app.get('/', (req, res) => {
  
  if (res.status !== 401){
    res.render('index')
  }  else {
    res.render('index2')
  }
  
})


app.get('/logged_in', (req, res) => {
  // res.sendFile(__dirname + "/views/index.html")
   res.render('index2');
 })



/* GET home page. *//*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/






module.exports = app