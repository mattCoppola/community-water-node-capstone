const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }
});

// Returns user information without password info
userSchema.methods.serialize = function () {

    return {
        username: this.username || '',
    };
};

// Validates password using bcryptjs
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
    //    bcrypt.compare(password, this.password, (err, isValid) => {
    //        if (err) {
    //            return;
    //        }
    //        return isValid;
    //    });
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', userSchema, 'user');

module.exports = {
    User
};
