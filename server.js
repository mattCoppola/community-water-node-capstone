'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {
    DATABASE_URL,
    PORT
} = require('./config');

const app = express();

const User = require('./models/user');

app.use(morgan('common'));
app.use(express.json());

app.use(express.static('public'))

// signing in a user
app.post('/users/login', function (req, res) {

    // grab username and password from ajax api call
    const username = req.body.username;
    const password = req.body.password;

    console.log(username + " & " + password);
    // connect to DB with mongoose schema
    User.findOne({
        username: username
    }, function (err, items) {
        if (err) {
            return res.status(500).json({
                message: "Error connection to the DB"
            });
        }
        if (!items) {
            return res.status(401).json({
                message: "No users with this username"
            });
        } else {
            items.validatePassword(password, function (err, isValid) {
                if (err) {
                    return res.status(500).json({
                        message: "Could not connect to DB to validate password"
                    });
                }
                if (!isValid) {
                    return res.status(401).json({
                        message: "Password Invalid"
                    });
                } else {
                    return res.json(items);
                }
            });
        };
    });
});


// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {
    runServer,
    app,
    closeServer
};
