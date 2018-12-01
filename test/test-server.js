'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

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


// tearDownDb
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

//TESTS
// build one at a time, test and comment after complete

//Create a new result
// status-200
//Read/Get users results after login

//Update an existing result

//Delete an existing result

describe('/api/users', function () {
    const username = 'testUser';
    const password = 'testPass';

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    after(function () {
        return closeServer();
    });

    beforeEach(function () {});

    afterEach(function () {
        return User.remove({});
    });

    describe('POST', function () {
        it('Should create a new user', function () {
            return chai
                .request(app)
                .post('/api/users')
                .send({
                    username,
                    password
                })
                .then(res => {
                    expect(res).to.have.status(200);
                });
        });
    });
});
