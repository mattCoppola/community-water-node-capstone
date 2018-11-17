'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://demo:demo123@ds037097.mlab.com:37097/community-water';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://demo:demo123@ds037097.mlab.com:37097/community-water';

exports.PORT = process.env.PORT || 8080;
