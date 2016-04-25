var sequelize_endpoint = require("./sequelize_endpoint");
var Product = require("./models/product");

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
	}
});
