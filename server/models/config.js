var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Config = sequelize.define('configs', {
  client_max_distance: {type: Sequelize.INTEGER, defaultValue: 300},
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

Config.get = function() {
	return Config.findOne({})
		.then(function(config) {
			if (config) return config.dataValues;

			return {
				client_max_distance: 300
			};
		});
};

module.exports = Config;