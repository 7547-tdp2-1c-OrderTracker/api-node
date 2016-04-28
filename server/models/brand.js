var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

module.exports = sequelize.define('brands', {
  name: Sequelize.STRING,
  picture: Sequelize.STRING,
  code: Sequelize.STRING,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE
}, {
  freezeTableName: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

