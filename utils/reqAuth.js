var express = require('express');
var jwt = require('jsonwebtoken');

var router = express.Router();
var app = require('../app.js');
var addAuth = require('./addAuth.js');