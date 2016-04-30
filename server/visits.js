var sequelize_endpoint = require("./sequelize_endpoint");
var Visit = require("./models/visit");

module.exports = sequelize_endpoint(Visit);

