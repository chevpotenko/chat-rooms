var express = require('express');
var path = require('path');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/users');

router.get('/logout', function(req, res, next) {  
    req.logout();
    res.redirect('/')
});

router.use('/', notLoggedIn, function(req, res, next) {  
    next();
});
  
router.get('/signup', function(req, res, next) {  
    res.sendFile(path.join(__dirname, '../', '/public/index.html'));
});
  
router.get('/signin', function(req, res, next) {  
    res.sendFile(path.join(__dirname, '../', '/public/index.html'));
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
  
function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}