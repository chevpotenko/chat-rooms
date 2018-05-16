var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/users');

router.get('/', (req, res, next) => { 
    Users.find({}, function(err, users) {
        if(err){
            console.log('Users:' + err); 
        }else{ 
            res.json(users);
        }   
    });
});
  
router.post('/', (req, res, next) => {  
    passport.authenticate('local.signup', function(err, user, info) {
        if (err) {
            return next(err);      
        }
        if(!user){
            res.status(401).send(info);
        }else{
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.json(req.body);
            });  
        }
    })(req, res, next);
});

router.post('/signin', (req, res, next) => {  
    passport.authenticate('local.signin', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if(!user){
            res.status(401).send(info);
        }else{
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.json({value: true});
            });      
        }
    })(req, res, next);
});

module.exports = router;