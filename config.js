'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://demo:demo123@ds037097.mlab.com:37097/community-water';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://demo:demo123@ds123444.mlab.com:23444/community-water-test';

exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET || 'TEST_SECRET_KEY';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
