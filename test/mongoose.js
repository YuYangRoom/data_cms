
describe('Mongoose', function() {

    var assert = require('assert'),
        config = require('../config/Config'); //declar all models

    beforeEach( function (done) {
        done();
    });

    it('should work with syntax keyword or', function (done) {
        var Restaurant = require('../models').Restaurant;
        Restaurant.load('53869887e2d466a220000006', function(err , r) {
            console.log(r);
        });
    });
});

describe('Testing', function () {

    it('should print word : works', function () {
        console.log('works');
    });

});