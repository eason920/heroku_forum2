const express = require('express');
const router = express.Router();
router.use(express.static('./public'));

// firebase
const firebaseClient = require('../connections/firebase_client');
const firebaseAdmin = require('../connections/firebase_admin');
const fauth = firebaseClient.auth();
const fdb = firebaseAdmin.database();

// Plugin
const csrf = require('csurf');
const protect = csrf({cookie: true});

// Ref
const usersRef = fdb.ref('/15-db2/user');

// GET UI
router.get('/signup', protect, function (req, res) {
	const info = req.flash('info');
	res.render('auth/signup', {
		csrfToken: req.csrfToken(),
		nav: '',
		auth: '',
		info,
		hasInfo: info.length > 0
	});
});

router.get('/login', protect, function (req, res) {
	const info = req.flash('info');
	res.render('auth/login', {
		csrfToken: req.csrfToken(),
		nav: '',
		auth: '',
		info,
		hasInfo: info.length > 0
	});
});

// POST
router.post('/signup', function (req, res) {
	const email = req.body.email;
	const password = req.body.password;
	fauth.createUserWithEmailAndPassword(email, password)
		.then(function (user) {
			// console.log(user.user.uid);
			const uid = user.user.uid;
			const data = {
				email,
				password,
				uid
			}
			usersRef.child(uid).set(data);
			req.flash('info', '註冊成功');
			res.redirect('/auth/login');
		}).catch(function (error) {
			req.flash('info', '此電子郵件己被註冊');
			res.redirect('/auth/signup');
		})
})

router.post('/login', function (req, res) {
	const email = req.body.email;
	const password = req.body.password;
	fauth.signInWithEmailAndPassword(email, password)
		.then(function (user) {
			req.session.uid = user.user.uid;
			// console.log('uid', user.user.uid);
			// console.log('session', req.session.uid);
			res.redirect('/success');
		}).catch(function (error) {
			req.flash('info', '帳號或密碼錯誤');
			res.redirect('/auth/login');
		});
});

router.post('/logout', function(req, res){
	req.session.uid = '';
	req.flash('info', '登出成功');
	res.send('');
	res.end();
});

module.exports = router;
