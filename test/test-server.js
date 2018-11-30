'use strict'

const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const {
    User,
    Result
} = require('../models/user');
const {
    app,
    runServer,
    closeServer
} = require('../server');

const jwt = require('jsonwebtoken');
const {
    JWT_SECRET
} = require('../config');

//Test database url import
const {
    TEST_DATABASE_URL
} = require('../config');

chai.use(chaiHttp);


//TESTS

//Create a new result

//Read/Get users results after login

//Update an existing result

//Delete an existing result
