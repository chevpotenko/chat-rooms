var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/users');
var nodemailer = require('nodemailer');

var config = require('../config/config');

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
            mailOptions.to = res.body.email;        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
            });
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
                return res.json({ value: true });
            });      
        }
    })(req, res, next);
});

module.exports = router;

var transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: true,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

var mailOptions = {
    from: 'Chat rooms app',
    to: '', 
    subject: 'Invitation to chat rooms', 
    text: 'Welcome to chat rooms',
    html: '<h2>Welcome to chat rooms</h2>'
};