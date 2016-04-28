var sequelize_endpoint = require("./sequelize_endpoint");
var Seller = require("./models/seller");

module.exports = sequelize_endpoint(Seller);

