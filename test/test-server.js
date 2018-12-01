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

// Generate results data
function generateResults() {
    return {
        user: '5bdb1a4ec1f6120138497cd5',
        address: {
            street: '1234 Chicago Way',
            city: 'Chicago',
            state: 'IL',
            zip: 60606
        },
        testResults: {
            firstDraw: 1,
            threeMinute: 3,
            fiveMinute: 2
        }
    };
};

// Seed Results DB
function seedResultsDb() {
    console.info('seeding results data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateResults());
    }

    return Result.insertMany(seedData);
}

//TESTS
// build one at a time, test and comment after complete

//Delete an existing result


// CREATE A NEW USER
//describe('/api/users', function () {
//    const username = 'testUser';
//    const password = 'testPass';
//
//    before(function () {
//        return runServer(TEST_DATABASE_URL);
//    });
//
//    after(function () {
//        return closeServer();
//    });
//
//    beforeEach(function () {});
//
//    afterEach(function () {
//        return User.remove({});
//    });
//
//    describe('POST: Create a new user', function () {
//        it('Should create a new user', function () {
//            return chai
//                .request(app)
//                .post('/api/users')
//                .send({
//                    username,
//                    password
//                })
//                .then(res => {
//                    expect(res).to.have.status(200);
//                });
//        });
//    });
//});

//GET ALL RESULTS
describe('Results API resource', function () {
    const username = 'testUser';
    const password = 'testPass';

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    after(function () {
        return closeServer();
    });

    beforeEach(function () {
        return User.hashPassword(password).then(password => {
            User.create({
                username,
                password
            });
        });
    });

    beforeEach(function () {
        return seedResultsDb();
    });

    afterEach(function () {
        return tearDownDb();
    });
    //
    //    describe('GET endpoint', function () {
    //        it('should return all results', function () {
    //            let res;
    //            const token = jwt.sign({
    //                    user: {
    //                        username
    //                    }
    //                },
    //                JWT_SECRET, {
    //                    algorithm: 'HS256',
    //                    subject: username,
    //                    expiresIn: '7d'
    //                });
    //            return chai.request(app)
    //                .get(`/api/results/${username}`)
    //                .set('Authorization', `Bearer ${token}`)
    //                .then(function (_res) {
    //                    res = _res;
    //                    expect(res).to.have.status(200);
    //                });
    //        });
    //    });


    // UPDATE EXISTING RESULTS
    //    describe('PUT endpoint', function () {
    //        it('should update results data', function () {
    //            const updateData = {
    //                street: '5555 Chicago Ave',
    //                city: 'Chicago',
    //                state: 'IL',
    //                zip: '60678',
    //                firstDraw: 5,
    //                threeMinute: 7,
    //                fiveMinute: 2
    //            }
    //            let res;
    //            const token = jwt.sign({
    //                    user: {
    //                        username
    //                    }
    //                },
    //                JWT_SECRET, {
    //                    algorithm: 'HS256',
    //                    subject: username,
    //                    expiresIn: '7d'
    //                });
    //            return Result
    //                .findOne()
    //                .then(function (result) {
    //                    updateData.entryID = result.id;
    //                    console.log(updateData);
    //                    return chai.request(app)
    //                        .put(`/api/update-results/${result.id}`)
    //                        .set('Authorization', `Bearer ${token}`)
    //                        .send(updateData);
    //                })
    //                .then(function (_res) {
    //                    res = _res;
    //                    expect(res).to.have.status(204);
    //                });
    //        });
    //    });

    // DELETE EXISTING RESULTS
    describe('DELETE endpoint', function () {
        it('delete an existing record', function () {
            const token = jwt.sign({
                    user: {
                        username
                    }
                },
                JWT_SECRET, {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                });

            let result;

            return Result
                .findOne()
                .then(function (resResult) {
                    result = resResult;
                    return chai.request(app)
                        .delete(`/api/delete-results/${result.id}`)
                        .set('Authorization', `Bearer ${token}`)
                })
                .then(function (res) {
                    expect(res).to.have.status(200);
                });
        });
    });
});
