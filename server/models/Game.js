const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    players: [{
        email: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            default: 0
        },
        status:{
            type: String,
            enum: ['Invited', 'Joined']
        },
        _id: false
    }],
    status: {
        type: String,
        enum: ['new', 'ready-to-start', 'in-progress', 'finished'],
        default: 'new'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = Game = mongoose.model('game', GameSchema);