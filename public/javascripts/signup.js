// CHECK COLUMN
const $email = $('#email');
const $target = $('#password');
const $confirmPassword = $('#confirm_password');
const $confirmCheck = $('#confirm');
//
const $infoEmail = $('#infoEmail');
const $infoTarget = $('#infoTarget');
const $infoPassword = $('#infoPassword');
const $infoCheck = $('#infoCheck');

const check = function(){
	let target = $target.val();
	let check = $confirmPassword.val();
	if (check !== target) {
		$infoPassword.text('與密碼不相符');
	} else {
		$infoPassword.text('');
	}
}

$email.on('keyup', function () {
	if($(this).val() !== ''){
		$infoEmail.text('');
	}
});

$target.on('keyup', function () {
	check();
	if($(this).val() !== ''){
		$infoTarget.text('');
	}
	if($(this).val().length < 6){
		$infoTarget.text('最少 6 碼')
	}
});

$confirmPassword.on('keyup', function(){
	check();
});

$confirmCheck.on('click', function(){
	if( $(this).is(':checked') ){
		$infoCheck.text('');
	}
})

$('#submit').click(function(e){
	let target = $target.val();
	let check = $confirmPassword.val();
	switch(true){
		case $email.val().trim().length === 0:
			e.preventDefault();
			$infoEmail.text('請輸入 email ');
			break;
		case $target.val().trim().length === 0:
			e.preventDefault();
			$infoTarget.text('不可為空值及空白鍵');
			break;
		case check !== target && !$infoCheck.is(':checked'):
			e.preventDefault();
			$infoPassword.text('與密碼不相符');
			$infoCheck.text('請勾選確認');
			break;
		case check !== target:
			e.preventDefault();
			$infoPassword.text('與密碼不相符');
			break;
		case !$confirmCheck.is(':checked'):
			e.preventDefault();
			$infoCheck.text('請勾選確認');
			break;
		default:
			$('#authForm').submit();
	}
})


// ALERT ANIMATION
slideUp($('.alert'));