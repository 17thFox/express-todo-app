

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const index = require('./routes/index');
const todosApi = require('./routes/todos-api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


hbs.registerPartials(path.join(__dirname, '/views/partials'));


app.use(express.static(path.join(__dirname, 'public')));

// Register our {{{block}}} and {{#extend}}{{/extend}} helpers
require('./block-helpers')(hbs);

app.use('/', index);
app.use('/api/todos', todosApi);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
