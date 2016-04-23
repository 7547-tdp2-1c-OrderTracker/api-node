var pg_endpoint = require("./pg_endpoint");
var express = require("express");

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
			retailPrice: product.retail_price,
			wholesalePrice: product.wholesale_price,
			currency: product.currency
		};
	}
};

var mapGet = mapList;
var queryList = function(query, req, offset, limit) {
	if (req.query.brand_id) {
		var p = function(x){return parseInt(x);}
		var brand_ids = req.query.brand_id.split(",").map(p);
		return query("SELECT products.id, products.name, products.code, products.picture, products.thumbnail, products.description, products.stock, products.retail_price, products.wholesale_price, products.currency, products.brand_id, brands.name as brand_name FROM products JOIN brands ON brands.id = products.brand_id WHERE products.brand_id = ANY($3) ORDER BY name OFFSET $1::int LIMIT $2::int", [offset, limit, brand_ids]);
	} else {
		return query("SELECT products.id, products.name, products.code, products.picture, products.thumbnail, products.description, products.stock, products.retail_price, products.wholesale_price, products.currency, products.brand_id, brands.name as brand_name FROM products JOIN brands ON brands.id = products.brand_id ORDER BY name OFFSET $1::int LIMIT $2::int", [offset, limit]);
	}
};
var queryGet = "SELECT products.id, products.name, products.code, products.picture, products.thumbnail, products.description, products.stock, products.retail_price, products.wholesale_price, products.currency, products.brand_id, brands.name as brand_name FROM products JOIN brands ON brands.id = products.brand_id WHERE products.id = $1::int";
var queryCount = function(query, req) {
	if (req.query.brand_id) {
		var p = function(x){return parseInt(x);}
		var brand_ids = req.query.brand_id.split(",").map(p);
		return query("SELECT COUNT(*) FROM products JOIN brands ON brands.id = products.brand_id WHERE products.brand_id = ANY($1)", [brand_ids]);
	} else {
		return query("SELECT COUNT(*) FROM products JOIN brands ON brands.id = products.brand_id");
	}
};

var products = pg_endpoint("products", queryList, queryCount, queryGet, mapList, mapGet, {
	fields: ["name", "brand_id", "description", "thumbnail", "picture", "stock", "retail_price", "wholesale_price", "currency"]
});

var readAliasFields = function(req, res, next) {
	if (req.method === "POST" || req.method === "PUT") {
		if (req.body.retailPrice) {
			req.body.retail_price = req.body.retailPrice;
		}
		if (req.body.wholesalePrice) {
			req.body.wholesale_price = req.body.wholesalePrice;
		}
	}
	next();

}

var app = express();

app.use(readAliasFields);
app.use(products);


module.exports = app;