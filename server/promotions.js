var sequelize_endpoint = require("./sequelize_endpoint");
var Promotion = require("./models/promotion");

module.exports = sequelize_endpoint(Promotion);
