var pg_endpoint = require("./pg_endpoint");
module.exports = pg_endpoint("products", function(req, res) {
	var fullUrl = req.protocol + '://' + req.get('host');
	if (req.get('port')) {
		fullUrl = fullUrl + ":" + req.get('port');
	}

	fullUrl = fullUrl + "/images";

	return function(product) {
		if (product.thumbnail && product.thumbnail[0] === "/") {
			product.thumbnail = fullUrl + product.thumbnail;
		}
		if (product.picture && product.picture[0] === "/") {
			product.picture = fullUrl + product.picture;
		}
		return product;
	}
});
