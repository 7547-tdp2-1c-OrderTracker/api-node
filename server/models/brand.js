var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

module.exports = sequelize.define('brands', {
  name: Sequelize.STRING,
  picture: Sequelize.STRING,
  code: Sequelize.STRING
}, {
  freezeTableName: true,
  timestamps: false
});

