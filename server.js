'use strict';

const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
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

// Create new results
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
//Authorized PUT Endpoints //
/////////////////////////////
app.put('/api/update-results/:id', jwtAuth, (req, res) => {

    Result.findByIdAndUpdate(req.params.id, {
        $set: {
            "address.street": req.body.street,
            "address.city": req.body.city,
            "address.state": req.body.state,
            "address.zip": req.body.zip,
            "testResults.firstDraw": req.body.firstDraw,
            "testResults.threeMinute": req.body.threeMinute,
            "testResults.fiveMinute": req.body.fiveMinute
        }
    }).then(function (result) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

////////////////////////////////
//Authorized DELETE Endpoints //
////////////////////////////////

app.delete('/api/delete-results/:id', jwtAuth, (req, res) => {
    console.log('Deleting ID: ', req.params.id);

    Result.findByIdAndRemove(req.params.id)
        .then(function (result) {
            return res.status(200).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});


/////////////////////////////
//Authorized GET Endpoints //
/////////////////////////////

// Read user info for displaying on website
app.get('/api/results/:username', jwtAuth, (req, res) => {
    Result.find()
        .sort(
            "testResults.created"
        )
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

// Get seed data for mapping results
app.get('/api/seed-data/:username', jwtAuth, (req, res) => {
    Result.find()
        .sort(
            "testResults.created"
        )
        .then(function (results) {
            let resultsOutput = [];
            let testAverages = [];
            results.map(function (result) {
                resultsOutput.push(result);
                testAverages.push(result.average());
            });
            console.log(testAverages);
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
