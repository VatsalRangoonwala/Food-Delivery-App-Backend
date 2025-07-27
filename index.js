var mongoose = require('mongoose');
var express = require('express');
var mgClient = require('./connection/dbconnect')
var app = express();
var bodyParser =  require("body-parser");
var expressValidator = require("express-validator");
const session = require('express-session');
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
const path  = require('path');


var cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('upload/fooditemImg'));
app.use(express.static('upload/foodstoreImg'));
app.use(express.static(path.join(__dirname,'upload')));
app.use(express.static(path.join(__dirname,'public')));


app.engine('html',require('ejs').renderFile);
app.set("view engine","html");
app.set("views","views");

const adminController = require('./controller/adminController')
app.use('/admin',adminController);

const userController = require('./controller/userController')
app.use('/user',userController);


app.listen(3000);