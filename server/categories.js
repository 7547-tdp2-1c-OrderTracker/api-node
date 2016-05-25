var sequelize_endpoint = require("./sequelize_endpoint");
var Category = require("./models/category");

module.exports = sequelize_endpoint(Category, {
	order: function() {
		return [
			["name", "ASC"]
		];
	}
});
