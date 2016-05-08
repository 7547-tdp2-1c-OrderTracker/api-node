var sequelize_endpoint = require("./sequelize_endpoint");
var Product = require("./models/product");
var Brand = require("./models/brand");
var Promotion = require("./models/promotion");

var moment = require("moment");

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
		return [
			["name", "ASC"],
			[Promotion, "percent", "DESC"],
			[Brand, Promotion, "percent", "DESC"]
		];
	},
	include: function(req) {
		var now = req.query.date ? moment(req.query.date) : moment();

		return [{
			model: Brand,
			attributes: ['name'],
			include: [{
				model: Promotion,
				where: {begin_date: {$lte: now.toDate()}, end_date: {$gte: now.toDate()}},
				required: false,
				attributes: ['id', 'name', 'percent', 'begin_date', 'end_date']
			}]
		}, {
			model: Promotion,
			where: {begin_date: {$lte: now.toDate()}, end_date: {$gte: now.toDate()}},
			required: false,
			attributes: ['id', 'name', 'percent', 'begin_date', 'end_date']
		}];
	},
	map: function(product) {
		if (product.brand) {
			product.brand_name = product.brand.name;
		}
		return product;
	}
});
