let mongoose = require('mongoose');

let roomSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    todo:{
        type: Array
    }   
});

roomSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('rooms', roomSchema);