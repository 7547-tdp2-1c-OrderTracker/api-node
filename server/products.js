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
			brand: product.brand_name,
			brand_id: product.brand_id,
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
var queryList = "SELECT products.id, products.name, products.code, products.picture, products.thumbnail, products.description, products.stock, products.retail_price, products.wholesale_price, products.currency, products.brand_id, brands.name as brand_name FROM products JOIN brands ON brands.id = products.brand_id OFFSET $1::int LIMIT $2::int";
var queryGet = "SELECT products.id, products.name, products.code, products.picture, products.thumbnail, products.description, products.stock, products.retail_price, products.wholesale_price, products.currency, products.brand_id, brands.name as brand_name FROM products JOIN brands ON brands.id = products.brand_id WHERE products.id = $1::int";

module.exports = pg_endpoint("products", queryList, queryGet, mapList, mapGet);
