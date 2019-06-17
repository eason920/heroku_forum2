const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const forumRouter = require('./routes/forum');
const authRouter = require('./routes/auth');
const successRouter = require('./routes/success');
const dashboardRouter = require('./routes/dashboard');
const contactRouter = require('./routes/contact');

const app = express();

// ejs
const ejs = require('express-ejs-extend');
app.engine('ejs', ejs);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session + flash
const session = require('express-session');
app.use(session({
	secret: 'happy Eason',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 3600 * 1000 }
}));
const flash = require('connect-flash');
app.use(flash());

// DOTENV
require('dotenv').config();

// validator
const validator = require('express-validator');
app.use(validator());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const admin = function (req, res, next) {
	const uid = req.session.uid;
	if (uid) {
		if (uid === process.env.FIREBASE_USER1 || uid === process.env.FIREBASE_USER2) {
			return next()
		} else {
			req.flash('info', '這不是管理者帳號');
			res.redirect('/forum');
		}
	}else{
		req.flash('info', '您尚未登入');
		res.redirect('/forum');		
	}
}
const login = function (req, res, next) {
	const uid = req.session.uid;
	if (uid) {
		next()
	}else{
		req.flash('info', '請先登入 !');
		res.redirect('/forum');		
	}

}

app.use('/contact', contactRouter);
app.use('/forum', forumRouter);
app.use('/auth', authRouter);
app.use('/success', login, successRouter);
app.use('/dashboard', admin, dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	const err = new Error('not Found');
	err.status = 404;
	return res.render('error', {
		title: '沒有此頁 :('
	});
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