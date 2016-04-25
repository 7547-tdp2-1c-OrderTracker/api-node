var sequelize_endpoint = require("./sequelize_endpoint");

var Client = require("./models/client", {
	order: function() {
		return "lastname ASC";
	}
});

module.exports = sequelize_endpoint(Client);
