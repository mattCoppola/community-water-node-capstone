'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const {
    User,
    Result
} = require('../models/user');

const router = express.Router();

const jsonParser = bodyParser.json();

// creating a new user
router.post('/', jsonParser, (req, res) => {

    //take the name, username and the password from the ajax api call
    let username = req.body.username;
    let password = req.body.password;

    //exclude extra spaces from the username and password
    username = username.trim();
    password = password.trim();

    let findDuplicates;
    User.find({
        username
    }).count(function (err, results) {
        findDuplicates = results;

        if (findDuplicates > 0) {
            return res.status(422).json({
                message: 'Username is already taken'
            });
        } else {
            //create an encryption key
            bcrypt.genSalt(10, (err, salt) => {

                //if creating the key returns an error...
                if (err) {

                    //display it
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }

                //using the encryption key above generate an encrypted pasword
                bcrypt.hash(password, salt, (err, hash) => {

                    //if creating the ncrypted pasword returns an error..
                    if (err) {

                        //display it
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    }

                    //using the mongoose DB schema, connect to the database and create the new user
                    User.create({
                        username,
                        password: hash,
                    }, (err, item) => {

                        //if creating a new user in the DB returns an error..
                        if (err) {
                            //display it
                            return res.status(500).json({
                                message: 'Internal Server Error'
                            });
                        }
                        //if creating a new user in the DB is succefull
                        if (item) {

                            //display the new user
                            return res.json(item);
                        }
                    });
                });
            });
        }
    });
});



module.exports = {
    router
};
