// AJAX update
let update;
$('.path-input-input').on('keyup', function(e){
	const val = $(this).val();
	const $small = $(this).siblings('small');
	switch (true) {
		case /[\u4e00-\u9fa5]/.test(val):
			$small.text('路徑請勿使用中文');
			return update = false;
		case /^\d/.test(val):
			$small.text('路徑第一字請用英文字母');
			return update = false;
		default:
			$small.text('');
			return update = true;
	}
});

$('.ajax-update').on('click', function(e){
	e.preventDefault();
	const id = $(this).data('id');
	const orgPath = $(this).data('path');
	const $small = $(this).parent().siblings('.path-input').find('small');
	const path = $(this).parent().siblings('.path-input').find('input').val();
	if(update || update === undefined){
		const check = confirm(`確定將「${orgPath}」改作「${path}」?`);
		if(check){
			$.ajax({
				url: '/dashboard/categories/update/' + id ,
				type: 'post',
				data: {path}
			}).done(function(res){
				$('.col-md-6').prepend(
					$('<div>').attr('class', 'alert alert-success').text(res)
				);
				$('html').animate({scrollTop: 0});
				slideUp($('.alert'));
			})
		}
	}else{
		$small.addClass('ani');
		setTimeout(function () {
			$small.removeClass();
		}, 800);
	}
	// error vv
	// $.post(`/dashboard/categories/delete${id}`,function(a, b, c){
	// 	console.log('a >>', a, 'b>>>', b, 'c>>>', c);
	// });
	// window.location = '/dashboard/categories/update/' + id;
});

// AJAX delete
$('.ajax-del').on('click', function(e){
	e.preventDefault();
	const id = $(this).data('id');
	const check = confirm(`確定要刪除分類「${$(this).data('title')}」? \n(原分類文章分類至「未分類)`);
	if(check){
		$.ajax({
			url: '/dashboard/categories/delete/' + id,
			type: 'post'
		}).done(function(){
			window.location = '/dashboard/categories';
		});
	};
})

// alert UI animate
slideUp($('.alert'));

// test chinese
const valErr = function(e){
	const $target = $('#path');
	const $small = $target.siblings('small');
	const val = $target.val();
	switch(true){
		case /[\u4e00-\u9fa5]/.test(val):
			e.preventDefault();
			$small.text('路徑請勿使用中文');
			break;
		case /^\d/.test(val):
			e.preventDefault();
			$small.text('路徑第一字請用英文字母');
			break;
		default:
			$small.text('');
	}
}

$('#path').on('keyup', function(e){
	valErr(e);
})
$('#testPath').on('click', function (e) {
	valErr(e);
	const $small = $('#path').siblings('small');
	$small.addClass('ani');
	setTimeout(function(){
		$small.removeClass();
	}, 800);
});


// AJAX get JSON (unuse)
let data = {};
$.ajax({
	url: '/dashboard/categories/data',
	type: 'post'
}).done(function (res) {
	data = res;
	// console.log(data);
});