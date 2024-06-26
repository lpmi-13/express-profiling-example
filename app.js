var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var crypto = require('crypto');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const users = [];

app.get('/newUser', (req, res) => {
    let username = req.query.username || '';
    const password = req.query.password || '';

    username = username.replace(/[!@#$%^&*]/g, '');

    if (!username || !password || users[username]) {
        return res.sendStatus(400);
    }

    const salt = crypto.randomBytes(128).toString('base64');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

    users[username] = { salt, hash };

    res.sendStatus(200);
});

app.get('/auth', (req, res) => {
    let username = req.query.username || '';
    const password = req.query.password || '';

    username = username.replace(/[!@#$%^&*]/g, '');

    if (!username || !password || !users[username]) {
        return res.sendStatus(400);
    }

    const { salt, hash } = users[username];
    // this is the slow part
    const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

    if (crypto.timingSafeEqual(hash, encryptHash)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
