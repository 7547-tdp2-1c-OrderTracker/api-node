var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Config = sequelize.define('configs', {
  client_max_distance: {type: Sequelize.INTEGER, defaultValue: 300},
  auth_admin: {type: Sequelize.BOOLEAN, defaultValue: false},
  auth_seller: {type: Sequelize.BOOLEAN, defaultValue: false},
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  hooks: {
    beforeUpdate: sequelize.onlyAdmin,
    beforeCreate: sequelize.onlyAdmin
  },
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

Config.get = function() {
	return Config.findOne({})
		.then(function(config) {
			if (config) return config.dataValues;

			return {
				client_max_distance: 300,
				auth_admin: false,
				auth_seller: false
			};
		});
};

module.exports = Config;