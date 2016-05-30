var Sequelize = require("sequelize");
var sequelize_endpoint = require("./sequelize_endpoint");
var Product = require("./models/product");
var Brand = require("./models/brand");
var Promotion = require("./models/promotion");
var Category = require("./models/category");

var default_product_picture = "http://www.higieneplus.com.ar/wp-content/themes/higieneplus/images/producto-sin-foto.jpg";
var moment = require("moment");
var _ = require("underscore");
var q = require("q");

var where = function(req, res) {
	if (req.query.brand_id) {
		var p = function(x){return parseInt(x);}
		var brand_ids = req.query.brand_id.split(",").map(p);

		return {brand_id: {$in: brand_ids}};
	} else {
		return {};
	}
};

var saveCategories = function(req) {
	req.strcategories = req.body.categories;
	delete req.body.categories;
};

var upsertCategories = function(req, product) {
	var upsertCategory = function(category_name) {
		if (category_name === "") return;

		return Category.findOne({where: {name: category_name}})
			.then(function(category) {
				if (category) {
					return category;
				} else {
					return Category.create({name: category_name}, {authInfo: req.authInfo});
				}
			});
	};

	if (req.strcategories) {
		return q.all(req.strcategories.split(",").map(upsertCategory))
			.then(function(categories) {
				product.setCategories(categories);
			});
	}
};

module.exports = sequelize_endpoint(Product, {
	where: where,
	beforePut: saveCategories,
	beforePost: saveCategories,
	afterPut: upsertCategories,
	afterPost: upsertCategories,
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
				attributes: ['id', 'name', 'percent', 'begin_date', 'end_date', 'min_quantity']
			}]
		}, {
			model: Promotion,
			where: {begin_date: {$lte: now.toDate()}, end_date: {$gte: now.toDate()}},
			required: false,
			attributes: ['id', 'name', 'percent', 'begin_date', 'end_date', 'min_quantity']
		}, {
			model: Category
		}];
	},
	map: function(product) {
		if (product.brand) {
			product.brand_name = product.brand.name;
		}

		if (!product.picture) {
			product.picture = default_product_picture;
		}

		if (!product.thumbnail) {
			product.thumbnail = product.picture;
		}

		if (product.categories) {
			product.categories = product.categories.map(_.property("name")).join(",");
		}

		return product;
	}
});
