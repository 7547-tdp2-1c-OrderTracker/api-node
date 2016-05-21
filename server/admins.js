var sequelize_endpoint = require("./sequelize_endpoint");
var Admin = require("./models/admin");

var hidePassword = function(entity) {
	delete entity.password;
	return entity;
};

module.exports = sequelize_endpoint(Admin, {map: hidePassword});
