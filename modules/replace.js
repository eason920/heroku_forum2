const replace = function(category){
	const category1 = '-LgvgBRDhZE95sV2sIRM';
	const category2 = '-LgvgEj17PXnQBfNfn83';
	const category3 = '-LgvgHX8SZ7BPwIB_Pg2';
	const category4 = '-LgxLmwkMQbHMudH8Kzn';
	switch(true){
		case category === 'news':
			category = category.replace('news', category1)
			break;
		case category === 'woman':
			category = category.replace('woman', category2)
			break;
		case category === 'man':
			category = category.replace('man', category3)
			break;
		case category === 'games':
			category = category.replace('games', category4)
			break;
		default:
	}
	return category;
}

module.exports = replace;