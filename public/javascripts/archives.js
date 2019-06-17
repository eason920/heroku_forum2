// AJAX post delete
$('.deletePost').click(function(e){
	e.preventDefault();
	const id = $(this).data('id');
	const title = $(this).data('title');
	const check = confirm(`確定要刪除「${title}」?`);
	if(check){
		$.ajax({
			url: `/dashboard/article/delete/${id}`,
			type: 'post'
		}).done(function(res){
			$('.col-md-6').prepend(
				$('<div>').attr('class', 'alert alert-success').text(res)
			);
			slideUp($('.alert'));
		})
	};
});


// category replace id to name
const category1 = '-LgvgBRDhZE95sV2sIRM';
const category2 = '-LgvgEj17PXnQBfNfn83';
const category3 = '-LgvgHX8SZ7BPwIB_Pg2';
const category4 = '-LgxLmwkMQbHMudH8Kzn';
$('.text').each(function(){
	let text = $(this).text();
	switch(true){
		case text.indexOf(category1) > 0:
			$(this).text( text.replace(category1, '新聞') );
			break;
		case text.indexOf(category2) > 0:
			$(this).text( text.replace(category2, '美女') );
			break;
		case text.indexOf(category3) > 0:
			$(this).text( text.replace(category3, '型男') );
			break;
		case text.indexOf(category4) > 0:
			$(this).text( text.replace(category4, '遊戲') );
			break;
		default:
	}
})