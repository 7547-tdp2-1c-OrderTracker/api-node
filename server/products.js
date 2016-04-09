var pg_endpoint = require("./pg_endpoint");

var mapList = function(req, res) {
	var fullUrl = req.protocol + '://' + req.get('host');
	if (req.get('port')) {
		fullUrl = fullUrl + ":" + req.get('port');
	}

	fullUrl = fullUrl + "/images";

	return function(product) {
		if (product.thumbnail && product.thumbnail[0] === "/") {
			product.thumbnail = fullUrl + product.thumbnail;
		}
		return {
			id: product.id,
			name: product.name,
			description: product.description,
			thumbnail: product.thumbnail,
			picture: product.picture,
			stock: product.stock,
			price: product.retail_price, // TODO: esto depende delcliente,
			currency: product.curreny
		};
	}
};

var mapGet = mapList;

module.exports = pg_endpoint("products", mapList, mapGet);
