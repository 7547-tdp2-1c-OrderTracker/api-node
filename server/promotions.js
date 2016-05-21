var sequelize_endpoint = require("./sequelize_endpoint");
var Promotion = require("./models/promotion");

var Product = require("./models/product");
var Brand = require("./models/brand");

module.exports = sequelize_endpoint(Promotion, {include: [{model: Product}, {model: Brand}]});
