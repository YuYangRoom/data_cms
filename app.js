
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3004);
  app.engine('ejs', engine);
  app.locals({
    _layoutFile: true
  })
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('weego'));
  app.use(express.cookieSession({'cookie':{maxAge:31557600000}}));
  app.use(express.session({ secret: "data_cms" }));
  app.use(function(req, res, next){
      res.locals.session = req.session;
      next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//label
routes(app);

io.on('connection', function(socket){
  socket.on('audittask', function(data) {
    // we tell the client to execute 'new message'
    var clients = io.socket.clients();
    clients.forEach(function(client) {
      if(client.name == data.to){
        client.emit('audittask', data);
      }
    })
    // socket.broadcast.emit('audittask', {
    //   message: data
    // });
  });
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
