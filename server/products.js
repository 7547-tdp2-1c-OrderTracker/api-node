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
			stock: product.stock || 0,
			retail_price: product.retail_price,
			retailPrice: product.retail_price,
			wholesale_price: product.wholesale_price,
			wholesalePrice: product.wholesale_price,
			currency: product.currency
		};
	}
};

var mapGet = mapList;
var queryList = function(query, req, offset, limit) {
	if (req.query.brand_id) {
		return query("SELECT products.id, products.name, products.code, products.picture, products.thumbnail, products.description, products.stock, products.retail_price, products.wholesale_price, products.currency, products.brand_id, brands.name as brand_name FROM products JOIN brands ON brands.id = products.brand_id WHERE products.brand_id = $3::int OFFSET $1::int LIMIT $2::int", [offset, limit, req.query.brand_id]);
	} else {
		return query("SELECT products.id, products.name, products.code, products.picture, products.thumbnail, products.description, products.stock, products.retail_price, products.wholesale_price, products.currency, products.brand_id, brands.name as brand_name FROM products JOIN brands ON brands.id = products.brand_id OFFSET $1::int LIMIT $2::int", [offset, limit]);
	}
};
var queryGet = "SELECT products.id, products.name, products.code, products.picture, products.thumbnail, products.description, products.stock, products.retail_price, products.wholesale_price, products.currency, products.brand_id, brands.name as brand_name FROM products JOIN brands ON brands.id = products.brand_id WHERE products.id = $1::int";
var queryCount = function(query, req) {
	if (req.query.brand_id) {
		return query("SELECT COUNT(*) FROM products JOIN brands ON brands.id = products.brand_id WHERE products.brand_id = $1::int", [req.query.brand_id]);
	} else {
		return query("SELECT COUNT(*) FROM products JOIN brands ON brands.id = products.brand_id");
	}
};

module.exports = pg_endpoint("products", queryList, queryCount, queryGet, mapList, mapGet, {
	fields: ["name", "brand_id", "description", "thumbnail", "picture", "stock", "retail_price", "wholesale_price", "currency"]
});
