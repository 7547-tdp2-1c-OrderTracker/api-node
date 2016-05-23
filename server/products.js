var Sequelize = require("sequelize");
var sequelize_endpoint = require("./sequelize_endpoint");
var Product = require("./models/product");
var Brand = require("./models/brand");
var Promotion = require("./models/promotion");

var default_product_picture = "http://www.higieneplus.com.ar/wp-content/themes/higieneplus/images/producto-sin-foto.jpg";
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
			Sequelize.literal('GREATEST(COALESCE("promotions"."percent",0),COALESCE("brand.promotions"."percent",0)) DESC'),
			["name", "ASC"]
		];
	},
	customCountQuery: function(req) {
		return Product.count({where: where(req)});
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

		if (!product.picture || !product.thumbnail) {
			product.picture = default_product_picture;
		}

		return product;
	}
});
