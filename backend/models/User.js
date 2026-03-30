const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30
    },
    email: {
        type: String,
        minlength: 10,
        maxlength: 30,
        unique: true,
        sparse: true 
    },
    phone: {
        type: String,
        match: /^[0-9]{10,11}$/,
        sparse: true
    },
    password: {
        type: String,
        minlength: 6
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unknown']
    },
    birthday: Date,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
