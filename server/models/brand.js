var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

module.exports = sequelize.define('brands', {
  name: Sequelize.STRING,
  picture: Sequelize.STRING,
  code: Sequelize.STRING,
  createdAt: {
    field: 'created_at',
    type: Sequelize.DATE
  },
  updatedAt: {
    field: 'updated_at',
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true
});

