
describe('Life Router', function () {

    var request = require('supertest'), 
        app;

    before(function () {

        var express = require('express'),
            routes  = require('../routes');
        

        app = express();

        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser('weego'));
        app.use(express.cookieSession({'cookie':{maxAge:31557600000}}));
        app.use(function(req, res, next){
            res.locals.session = req.session;
            next();
        });
        app.use(app.router);
        app.use(express.static(require('path').join(__dirname, '../public')));

        routes(app);
    });


    it('should simply work', function(done) {
        request(app)
            .get('/index.html')
            .expect(200, done);
            // .expect('Content-Type', /json/);
    });

    it('GET /shoppings/10/1?lifename=Liberty', function(done) {
        request(app)
            .get('/shoppings/10/1?lifename=Liberty')
            .expect(/Great Marlborough Street/, done);
    });

});