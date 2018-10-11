const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Student = require('../models/student.model');

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
    roles: {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        },
        coordinator: {
            type: Schema.Types.ObjectId,
            ref: 'Coordinator'
        }
    }
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

UserSchema.methods.setupRole = function () {
    const user = this;

    const isCoordinator = keys.coordinators.find(x => x === user.email);

    return new Promise((resolve, reject) => {
        if(isCoordinator){
            
        } else {
            const student = new Student({
                user: {
                    id: user._id,
                    name: user.name
                }
            });
            student
            .save()
            .then(student => {
                user.roles.student = student._id;
                user
                .save()
                .then(resolve)
            })
            .catch(reject);
        }
    });

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
            return newUser.setupRole();
        } else {
            return savedUser;
        }
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
