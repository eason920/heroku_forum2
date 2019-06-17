const express = require('express');
const router = express.Router();
router.use(express.static('./public'));

// Firebase
const firebaseAdmin = require('../connections/firebase_admin');
const fdb = firebaseAdmin.database();

// Ref
const categoriesRef = fdb.ref('/15-db2/categories');

// require
const mailer = require('nodemailer');
require('dotenv').config();

// Get UI
router.get('/', function(req, res){
	categoriesRef.once('value').then(function (snapshot) {
		const categories = snapshot.val();
		res.render('contact/contact', {
			cid: '',
			categories
		});
	});
});

router.get('/success', function(req, res){
	categoriesRef.once('value').then(function (snapshot) {
		const categories = snapshot.val();
		res.render('contact/success', {
			cid: '',
			categories
		});
	});
})

// POST
router.post('/', function(req, res){
	const transpoter = mailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EASON_MAIL,
			pass: process.env.EASON_PASSWORD
		}
	});
	const mailOptions = {
		to: 'eason920@gmail.com',
		subject: req.body.title,
		text: req.body.description
	}
	transpoter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		};
	});
	res.redirect('/contact/success');
})

module.exports = router;