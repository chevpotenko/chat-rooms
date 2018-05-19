var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var user = require('./routes/user');
var apiRooms = require('./routes/api-rooms');
var apiUsers = require('./routes/api-users');
var apiUser = require('./routes/api-user');

var config = require('./config/config');

mongoose.connect(config.db.connection);
var db = mongoose.connection;

db.once('open', function() {
    console.log('Connected to Mongo db');
});
db.on('error', function(err) {
    console.log(err);
});

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {maxAge: 180 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use('/', index);
app.use('/user', user);
app.use('/api/rooms', apiRooms);
app.use('/api/users', apiUsers);
app.use('/api/user', apiUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;