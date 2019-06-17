// alert UI animate
const slideUp = function (target) {
	const height = target.outerHeight();
	target.css({ maxHeight: height, height: height});
	setTimeout(function(){
		target.slideUp(500);
	}, 2300);
}