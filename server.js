'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {
    router: usersRouter
} = require('./users');
const {
    router: authRouter,
    localStrategy,
    jwtStrategy
} = require('./auth');


const {
    DATABASE_URL,
    PORT
} = require('./config');

const app = express();

const {
    User,
    Result
} = require('./models/user');

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'))

//Authentication
passport.use(localStrategy);
passport.use(jwtStrategy);

//Tells our app to use users and authentication routes
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

//Middleware for authenticating users
const jwtAuth = passport.authenticate('jwt', {
    session: false
});

/////////////////////////////
//Authorized POST Endpoints//
/////////////////////////////

app.post('/api/results', jwtAuth, (req, res) => {
    console.log('POSTing New Results');
    let userInfo = req.user;
    let userID = userInfo._id;

    const newResults = {
        address: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        },
        testResults: {
            firstDraw: req.body.firstDraw,
            threeMinute: req.body.threeMinute,
            fiveMinute: req.body.fiveMinute
        },
        user: userID
    };

    console.log('New Results: ', newResults);

    Result.create(newResults)
        .then(created => {
            res.status(201).json(created);
        })
        .catch(err => {
            console.log('Error: ', err);
            return res.status(500).json({
                error: 'internal server error'
            });
        });
});



/////////////////////////////
//Authorized GET Endpoints //
/////////////////////////////

app.get('/api/results/:username', jwtAuth, (req, res) => {
    Result.find()
        .then(function (results) {
            let resultsOutput = [];
            results.map(function (result) {
                if (req.user._id == result.user) {
                    resultsOutput.push(result);
                }
            });
            res.json({
                resultsOutput
            });
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error'
            });
        });
});


//// creating a new user
//app.post('/users/create', (req, res) => {
//
//    //take the name, username and the password from the ajax api call
//    let username = req.body.username;
//    let password = req.body.password;
//
//    //exclude extra spaces from the username and password
//    username = username.trim();
//    password = password.trim();
//
//    //create an encryption key
//    bcrypt.genSalt(10, (err, salt) => {
//
//        //if creating the key returns an error...
//        if (err) {
//
//            //display it
//            return res.status(500).json({
//                message: 'Internal server error'
//            });
//        }
//
//        //using the encryption key above generate an encrypted pasword
//        bcrypt.hash(password, salt, (err, hash) => {
//
//            //if creating the ncrypted pasword returns an error..
//            if (err) {
//
//                //display it
//                return res.status(500).json({
//                    message: 'Internal server error'
//                });
//            }
//
//            //using the mongoose DB schema, connect to the database and create the new user
//            User.create({
//                username,
//                password: hash,
//            }, (err, item) => {
//
//                //if creating a new user in the DB returns an error..
//                if (err) {
//                    //display it
//                    return res.status(500).json({
//                        message: 'Internal Server Error'
//                    });
//                }
//                //if creating a new user in the DB is succefull
//                if (item) {
//
//                    //display the new user
//                    return res.json(item);
//                }
//            });
//        });
//    });
//});

// signing in a user

//app.post('/users/login', function (req, res) {
//
//    // grab username and password from ajax api call
//    const username = req.body.username;
//    const password = req.body.password;
//
//    console.log(username + " & " + password);
//    // connect to DB with mongoose schema
//    User.findOne({
//        username: username
//    }, function (err, items) {
//        if (err) {
//            return res.status(500).json({
//                message: "Error connection to the DB"
//            });
//        }
//        if (!items) {
//            console.log('no users with this user name');
//            return res.status(401).json({
//                message: "No users with this username"
//            });
//        } else {
//            items.validatePassword(password, function (err, isValid) {
//                if (err) {
//                    return res.status(500).json({
//                        message: "Could not connect to DB to validate password"
//                    });
//                }
//                if (!isValid) {
//                    console.log('Password is Invalid');
//                    return res.status(401).json({
//                        message: "Password Invalid"
//                    });
//                } else {
//                    console.log(items);
//                    return res.json(items);
//                }
//            });
//        };
//    });
//});


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
