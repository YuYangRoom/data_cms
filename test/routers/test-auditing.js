
describe('Auditing Router', function () {

    var request = require('supertest'), 
        app;

    before(function () {

        var express = require('express'),
            routes  = require('../../routes');
        

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



    it('POST /savetoauditing', function(done) {
        var one = {
           _id: "52e62f8e4e59f08771000009"
           , auditorname: "weego"
           , city_name: "洛杉矶"
           , countryname: "美国"
           , editdate: "2014年7月4日 下午2:43:55"
           , editorname: "mojixiang"
           , name: "Nordstrom"
           , status: 1
           , type: "shoppings"
        }
        request(app)
            .post('/savetoauditing')
            .send({auditmsg:one})
            .expect(/Great Marlborough Street/, done);
    });

});