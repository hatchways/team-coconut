const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    profilePic: {
        type: String
    }
});

module.exports = User = mongoose.model('user', UserSchema);