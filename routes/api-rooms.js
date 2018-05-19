var express = require('express');
var router = express.Router();
var Rooms =require('../models/rooms');

router.get('/', function(req, res, next) {
    Rooms.find({ }, function(err, rooms) {
        if(err){
            console.log('Rooms:' + err); 
        }else{
            res.json(rooms);
        } 
    });
});

router.post('/', function(req, res, next) {
    var newRoom = new Rooms(req.body);        
    newRoom.save(function(err, result) {
        if(err) {
            
        }else{
            res.json(result);
        }        
    });
});

router.delete('/:id', function(req, res, next) {
    Rooms.remove({ _id: req.params.id }, function(err, result){
        res.json(result);
    });
});

router.put('/:id', function(req, res, next) {    
    Rooms.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, room) {
        res.json(room);
    });
});

module.exports = router;