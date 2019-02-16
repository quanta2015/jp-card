var cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var url = require('url');
var path = require('path');
var bodyParser = require('body-parser')
var fs = require('fs');

var filename =  path.resolve(__dirname,'.') + '/data/data.json';

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/getData', function (req, res) {
  
  var data = fs.readFileSync(filename,'utf-8');
  res.send(data);
})

app.get('/saveSucc', function (req, res) {
  var params = url.parse(req.url, true).query;
  var index = params.index;
  var type = params.type;

  var data = fs.readFileSync(filename,'utf-8');

  console.log(data)
  var jd = JSON.parse(data);
  jd.list[index].ln = type;


  fs.writeFile(filename, JSON.stringify(jd), function (err) {
    if (err) console.error(err);
    res.send(JSON.stringify(jd));
  });
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var http = require('http');
var port = 8888;
app.set('port', port);
var httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}
