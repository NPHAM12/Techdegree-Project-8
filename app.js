var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')

var routes = require('./routes/index');
var books = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// Handles 404 errors displaying page-not-found.pug
// catch 404 and forward to error handler
app.use( (req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404; //get status code
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('books/error', {
      // 3 variables will be passed to error.pug
      notice: "Server Error!!!",
      message: "Sorry! There was an unexpected error on the server.",
      error: err
    });
  });
}

module.exports = app;
