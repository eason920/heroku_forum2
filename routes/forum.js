const express = require('express');
const router = express.Router();
router.use(express.static('./public'));

// Firebase
const firebaseAdmin = require('../connections/firebase_admin');
const fdb = firebaseAdmin.database();

// Plugin
const striptags = require('striptags');
const moment = require('moment');
const pagenation = require('../modules/pagenation');
const replace = require('../modules/replace');

// Ref
const categoriesRef = fdb.ref('/15-db2/categories');
const articlesRef = fdb.ref('/15-db2/articles');

// Get UI
router.get('/', function (req, res) {
	let categories = {};
	categoriesRef.once('value').then(function(snapshot){
		categories = snapshot.val();
		return articlesRef.orderByChild('update_time').once('value');
	}).then(function(snapshot){
		let articles = [];
		snapshot.forEach(function(item){
			if(item.val().status === 'public'){
				articles.push(item.val());
			}
		});
		articles.reverse();
		const currentPN = req.query.pn || 1;
		const data = pagenation(articles, currentPN, 5);
		const info = req.flash('info');
		res.render('page_b', {
			categories,
			articles: data.data,
			page: data.page,
			striptags,
			moment,
			router: '/forum',
			cid: 'all',
			info,
			hasInfo: info.length > 0
		});
	});
});

router.get('/:cPath/:id', function (req, res) {
	const id = req.params.id;
	const cPath = req.params.cPath;
	let cid = ''
	let categories = {};
	categoriesRef.once('value').then(function (snapshot) {
		categories = snapshot.val();
		return categoriesRef.orderByChild('path').equalTo(cPath).once('value');
	}).then(function (snapshot) {
		snapshot.forEach(function (item) {
			cid = item.val().id;
		});
		return articlesRef.child(id).once('value');
	}).then(function (snapshot) {
		const articles = snapshot.val();
		if (articles === null) {
			return res.render('error', {
				title: '此篇文章不存在，或己刪除'
			})
		}else{
			res.render('page_c', {
				categories,
				articles,
				moment,
				cid
			});			
		}

	});
});

router.get('/:cPath', function (req, res) {
	let cPath = req.params.cPath;
	let cid = '';
	let categories = {};
	let data = {};
	categoriesRef.once('value').then(function(snapshot){
		categories = snapshot.val();
		return categoriesRef.orderByChild('path').equalTo(cPath).once('value');
	}).then(function(snapshot){
		// cid = snapshot.val().id;
		// console.log('cid', cid);
		snapshot.forEach(function(item){
			cid = item.val().id;
		});
		return articlesRef.orderByChild('update_time').once('value');
	}).then(function(snapshot){
		let articles = [];
		snapshot.forEach(function(item){
			if(item.val().status === 'public' && item.val().category === cid){
				articles.push(item.val());
			}
		});
		articles.reverse();
		const currentPN = req.query.pn || 1;
		data = pagenation(articles, currentPN, 5);
	}).then(function(){
		// console.log('d.d.length', data.data.length !== 0);
		if (data.data.length !== 0) {
			res.render('page_b', {
				categories,
				articles: data.data,
				page: data.page,
				striptags,
				moment,
				router: `/forum/${cPath}`,
				cid
			});
		} else {
			res.render('page_b_none', {
				categories,
				title: '此分類尚無文章 (或無此分類)'
			})
		}
	})
});



module.exports = router;