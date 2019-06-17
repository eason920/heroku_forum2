const express = require('express');
const router = express.Router();
const pagenation = require('../modules/pagenation');
router.use(express.static('./public'));

// Firebase
const admin = require('../connections/firebase_admin');
const fdb = admin.database();

// plugin
const striptags = require('striptags');
const moment = require('moment');

// Ref
const categoriesRef = fdb.ref('/15-db2/categories')
const articlesRef = fdb.ref('/15-db2/articles');

// Get UI
router.get('/archives', function (req, res) {
	const status = req.query.status || 'public';
	let categories = {};
	categoriesRef.once('value').then(function (snapshot) {
		categories = snapshot.val();
		return articlesRef.orderByChild('update_time').once('value');
	}).then(function (snapshot) {
		let articles = [];
		snapshot.forEach(function (item) {
			if (item.val().status === status) {
				articles.push(item.val());
			}
		})
		articles.reverse();
		const currentPN = req.query.pn || 1;
		const data = pagenation(articles, currentPN, 5);
		const auth = req.session.uid;
		res.render('dashboard/archives', {
			categories,
			articles: data.data,
			page: data.page,
			striptags,
			moment,
			status,
			hasStatus: status.length > 0,
			router: '/dashboard/archives',
			nav: 'archives',
			auth: auth.length > 0,
		});
	})
});

router.get('/article/:id', function (req, res) {
	const id = req.params.id;
	let categories = {}
	categoriesRef.once('value').then(function (snapshot) {
		categories = snapshot.val();
		return articlesRef.child(id).once('value');
	}).then(function (snapshot) {
		articles = snapshot.val();
		if (id !== 'creat' && articles === null) {
			return res.render('dashboard/error', {
				title: '此篇文章不存在或己刪除'
			})
		}
		res.render('dashboard/article', {
			categories,
			articles,
			nav: 'archives',
			auth: req.session.uid
		});
	})
});

router.get('/article/create', function (req, res) {
	categoriesRef.once('value', function (snapshot) {
		const categories = snapshot.val();
		res.render('dashboard/article', {
			categories,
			nav: 'archives',
			auth: req.session.uid
		});
	})
});

router.get('/categories', function (req, res) {
	const info = req.flash('info');
	let categories = [];
	categoriesRef.orderByChild('status').once('value').then(function (snapshot) {
		snapshot.forEach(function (item) {
			if (!item.val().status) {
				categories.push(item.val());
			}
		});
		return categoriesRef.orderByChild('status').equalTo('def').once('value');
	}).then(function (snapshot) {
		const categoriesDef = [];
		snapshot.forEach(function (item) {
			categoriesDef.push(item.val());
		})
		res.render('dashboard/categories', {
			categories,
			categoriesDef,
			info,
			hasInfo: info.length > 0,
			nav: 'categories',
			auth: req.session.uid
		});
	})
});

// Post
router.post('/article/create', function (req, res) {
	const articles = req.body;
	const push = articlesRef.push();
	const id = push.key;
	// articles.update_time = new Date().getTime();
	articles.update_time = new Date() / 1;
	articles.id = id;
	push.set(articles);
	// res.redirect(`/dashboard/article/${id}`)
	res.redirect('/dashboard/archives');
});

router.post('/article/update/:id', function (req, res) {
	const id = req.params.id;
	const articles = req.body;
	articlesRef.child(id).update(articles);
	res.redirect('/dashboard/archives')
});

router.post('/article/delete/:id', function (req, res) {
	const id = req.params.id;
	articlesRef.child(id).remove();
	res.send('刪除成功');
	res.end();
});

router.post('/categories/create', function (req, res) {
	req.checkBody('name', '分類不可為空').notEmpty();
	req.checkBody('path', '路徑不可為空').notEmpty();
	const validator = req.validationErrors();
	if (validator) {
		let info = [];
		validator.forEach(function (item) {
			info.push(item.msg + '、');
		})
		req.flash('info', info);
		res.redirect('/dashboard/categories');
	} else {
		const data = req.body;
		let filterName = {};
		let filterPath = {};
		categoriesRef.orderByChild('name').equalTo(data.name).once('value')
			.then(function (snapshot) {
				filterName = snapshot.val();
				return categoriesRef.orderByChild('path').equalTo(data.path).once('value')
			}).then(function (snapshot) {
				filterPath = snapshot.val();
			}).then(function () {
				switch (true) {
					case filterName === null && filterPath === null:
						req.flash('info', '分類新增成功')
						const categories = categoriesRef.push();
						const key = categories.key;
						data.id = key;
						categories.set(data)
						break;
					case filterName === null && filterPath !== null:
						req.flash('info', '路徑重複');
						break;
					case filterName !== null && filterPath === null:
						req.flash('info', '名稱重複');
						break;
					case filterName !== null && filterPath !== null:
						req.flash('info', '名稱及路徑重複');
						break;
					default:
				}
				res.redirect('/dashboard/categories');
			})
	}
});

router.post('/categories/update/:id', function (req, res) {
	const id = req.params.id;
	const newPath = req.body.path;
	console.log('newPath', newPath);
	categoriesRef.child(id).child('path').set(newPath);
	res.send('路徑修改成功');
	res.end();
});

router.post('/categories/delete/:id', function (req, res) {
	const id = req.params.id;
	const articles = [];
	const newData = {};
	console.log(id);

	articlesRef.orderByChild('category').equalTo(id).once('value')
		.then(function (snapshot) {
			snapshot.forEach(function (item) {
				console.log('id', item.val().id);
				articles.push(item.val());
			});
			for (let i in articles) {
				console.log('i', i);
				articles[i].category = '-LhGRzIAqvQIDqyV0fSk';
				newData[articles[i].id] = articles[i];
			}
			articlesRef.update(newData);
			return categoriesRef.child(id).remove();
		}).then(function () {
			req.flash('info', '分類己刪除，並將原有文章分類至「未分類」');
			// res.redirect('/dashboard/categories');
			res.send('');
			res.end();
		})
});

// AJAX get JSON (unuse)
router.post('/categories/data', function (req, res) {
	categoriesRef.once('value', function (ss) {
		res.send(ss.val());
	})
});

module.exports = router;