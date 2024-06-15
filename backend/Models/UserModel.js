const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    isVerified: { 
        type: Boolean, 
        default: true 
    }, 
    phoneNo: { 
        type: String, 
    }, 
    token: {
        type: String
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],

}, {timestamps:true})

const User = mongoose.model('User', UserSchema);
module.exports = User;