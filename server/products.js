var sequelize_endpoint = require("./sequelize_endpoint");
var Product = require("./models/product");
var Brand = require("./models/brand");

var where = function(req, res) {
	if (req.query.brand_id) {
		var p = function(x){return parseInt(x);}
		var brand_ids = req.query.brand_id.split(",").map(p);

		return {brand_id: {$in: brand_ids}};
	} else {
		return {};
	}
};

module.exports = sequelize_endpoint(Product, {
	where: where,
	order: function() {
		return "name ASC";
	},
	include: [{
		model: Brand,
		attributes: ['name']
	}],
	map: function(product) {
		if (product.brand) {
			product.brand_name = product.brand.name;
		}
		return product;
	}
});
