var loopback = require('loopback');
var boot = require('loopback-boot');
var fs = require('fs');
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator')

var app = module.exports = loopback();

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

// === Configure logs =====================================================
var logDirectory = __dirname + '/log';
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  date_format: 'YYYY-MM-DD',
  verbose: false
});
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));
