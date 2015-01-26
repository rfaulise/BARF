

//Base variables
var fs = require('fs');
var hbs = require('hbs');
var express = require('express');
var https = require('https');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gracenote = require("node-gracenote");

//Set route vars
var routes = require('./routes/index');
var video = require('./routes/video');
var epg = require('./routes/epg');

//Create express app
var app = express();

//Globals
//16176128-9E3D9B3EB8F3BA05E2BA0CF968132057 - music
//5375232-DA83FFC82C8A5056BBCDDD7414E40228 - video (internal)
//1957888-274CFAC4131DF04370558F5F6F11E3EA - video (public)
global.clientId = '5375232';
global.clientTag = 'DA83FFC82C8A5056BBCDDD7414E40228';
global.userId = null;
global.gnApi = null;

//Create Gracenote API instance
initGracenoteApi();


//Handlebars partials
//Register all hbs template in partials folder
var partialsDir = __dirname + '/views/partials';
var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

//Handlebars helpers
hbs.registerHelper('if_cond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Dependencies
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', routes);
app.use('/video', video);
app.use('/epg', epg);


//Set IP and Port
//Note set this to an internal network IP and make sure port isnt in use

var ip = '192.168.1.36';
var port = 2000;
//app.listen(port, ip);

http.createServer(app).listen(port,ip);
console.log('Server running at http://' + ip + ':'+port);
//https.createServer(options, app).listen(443);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function initGracenoteApi(){
	//1957888-274CFAC4131DF04370558F5F6F11E3EA
	var id = global.clientId;
	var tag = global.clientTag;
	var uid = global.userId;
	
	if (uid == null){
		var api = new gracenote(id,tag,uid);
	
		api.register(function(err, uid) {
		   global.userId = uid;
		   console.log("gnUserID=" + global.userId);
		});
		
		global.gnApi = api;
	}	
}

module.exports = app;
