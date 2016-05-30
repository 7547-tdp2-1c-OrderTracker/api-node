var sequelize_endpoint = require("./sequelize_endpoint");
var Brand = require("./models/brand");
var Promotion = require("./models/promotion");
var moment = require("moment");

module.exports = sequelize_endpoint(Brand, {

	include: function(req) {
		var now = req.query.date ? moment(req.query.date) : moment();
		return [{
			model: Promotion,
			where: {begin_date: {$lte: now.toDate()}, end_date: {$gte: now.toDate()}},
			required: false,
			attributes: ['id', 'name', 'percent', 'begin_date', 'end_date', 'min_quantity']
		}];
	},

	order: function() {
		return [
			["name", "ASC"],
			[Promotion, "percent", "DESC"]
		];
	}
});
