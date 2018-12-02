const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');

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

const resultsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    address: {
        street: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zip: {
            type: Number
        }
    },
    testResults: {
        firstDraw: {
            type: Number
        },
        threeMinute: {
            type: Number
        },
        fiveMinute: {
            type: Number
        },
        created: {
            type: Date,
            default: Date.now
        }
    }
});


// Obtain average from testResults
resultsSchema.methods.average = function () {
    return {
        average: ((this.testResults.firstDraw + this.testResults.threeMinute + this.testResults.fiveMinute) / 3).toFixed(2)
    }
}

// Returns user information without password info
userSchema.methods.serialize = function () {
    return {
        username: this.username || '',
    };
};

// Validates password using bcryptjs
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', userSchema, 'user');
const Result = mongoose.model('Result', resultsSchema);

module.exports = {
    User,
    Result
};
