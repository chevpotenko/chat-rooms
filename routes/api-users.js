var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../models/users');
var nodemailer = require('nodemailer');

var config = requireConfig('../config/config');

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
    from: 'no-reply',
    to: '', 
    subject: 'Invitation to chat rooms', 
    text: 'Welcome to chat rooms',
    html: '<h2>Welcome to chat rooms</h2>'
};

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
            mailOptions.to = req.body.email;        
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

function requireConfig(modulePath){
    try {
        return require(modulePath);
    }
    catch (e) {        
        return {
            email:{
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        };
    }
}