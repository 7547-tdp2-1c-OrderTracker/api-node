var sequelize_endpoint = require("./sequelize_endpoint");
var Brand = require("./models/brand");

module.exports = sequelize_endpoint(Brand);
