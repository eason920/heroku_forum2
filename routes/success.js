const express = require('express');
const router = express.Router();
router.use(express.static('./public'));

router.get('/', function(req, res){
	const auth = req.session.uid;
	res.render('success', {
		title: '登入成功',
		nav: '',
		auth
	})
});


module.exports = router;