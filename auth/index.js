'use strict'
//declare our auth router
const {
    router
} = require('./router');

//Import our strategies
const {
    localStrategy,
    jwtStrategy
} = require('./strategies');

//Export our router and strategies
module.exports = {
    router,
    localStrategy,
    jwtStrategy
};
