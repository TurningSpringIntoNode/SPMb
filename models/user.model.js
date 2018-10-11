const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    googleID: {
        type: String,
        required: true,
        unique: true
    },
    roles: [{
        
    }]
});

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    
    const token = jwt.sign({
        id: user._id.toHexString()
    }, keys.jwt.secret, {
        expiresIn: '12h'
    }).toString();

    return user.save().then(() => token);
};

UserSchema.statics.findByToken = function (token) {
    const User = this;

    let decodedUser = null;

    try {
        decodedUser = jwt.verify(token, keys.jwt.secret);
    } catch (e) {
        return Promise.reject();
    }

    return User.findById(decodedUser.id);
};

UserSchema.statics.findOrCreate = function (user) {
    const User = this;

    return User.findOne({
        googleID: user.googleID
    })
    .then(savedUser => {
        if(!savedUser){
            const newUser = new User(user);
            return newUser.save()
        } else {
            return savedUser;
        }
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
