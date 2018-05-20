var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/signin', (req, res, next) => {   
    if(req.user){
        res.json({ value: true });
    }else{        
        res.json({ value: false });
    } 
});

module.exports = router;