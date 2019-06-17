const pageNation = function(resource, currentPN,perPN){
	// page start
	const totalPage = resource.length;
	const perPNpage = perPN;
	const totalPN = Math.ceil(totalPage / perPNpage);
	//
	if(currentPN > totalPN){
		currentPN = totalPN;
	}else if(currentPN < 1){
		currentPN = 1;
	}
	//
	const firstPage = (currentPN - 1) * perPNpage + 1;
	const latestPage = firstPage + perPNpage - 1;
	//
	const data = [];
	resource.forEach(function (item, i) {
		i++;
		if (i >= firstPage && i <= latestPage) {
			data.push(item);
		}
	});
	return {
		data,
		page: {
			totalPN,
			currentPN: Number.parseInt(currentPN),
			hasPrePN: currentPN > 1,
			hasNexPN: currentPN < totalPN,
		}
	}
}

module.exports = pageNation;