const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const keys = require('jsonwebtoken');

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

const User = mongoose.model('User', UserSchema);

module.exports = User;
