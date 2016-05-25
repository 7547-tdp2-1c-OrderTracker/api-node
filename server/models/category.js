var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

module.exports = sequelize.define('categories', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  hooks: {
  	beforeUpdate: sequelize.onlyAdmin,
  	beforeCreate: sequelize.onlyAdmin
  },
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

