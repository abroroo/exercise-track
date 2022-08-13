const dotenv = require("dotenv");
dotenv.config('.env')
const express = require('express');
const path = require('path');
const cors = require('cors')
require('mongodb');
const mongoose = require('mongoose');
require('./config/database');
const app = express();
const userNameModel = require('./models/models');

const route = require('./routes/index');



app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views','./views');
/* 
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
*/
app.use(route);

app.get('/', function(req, res, next) {
  res.render('index');
  next()
});






module.exports = app