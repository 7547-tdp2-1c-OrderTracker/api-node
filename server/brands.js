var sequelize_endpoint = require("./sequelize_endpoint");
var Sequelize = require("sequelize");

var Brand = sequelize_endpoint.sequelize.define('brands', {
  name: Sequelize.STRING,
  picture: Sequelize.STRING,
  code: Sequelize.STRING
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = sequelize_endpoint(Brand);
