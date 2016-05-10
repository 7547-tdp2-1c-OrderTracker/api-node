var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Seller = require("./seller");

var Device  = sequelize.define('devices', {
  registration_token: Sequelize.STRING(1024),
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
});

Device.register = function(seller_id, data) {
	return Device.findOne({
		where: {registration_token: data.registration_token}
	})
		.then(function(instance) {
			if (instance) {
				return instance.update({seller_id: seller_id})
					.then(function() {
						return {
							body: instance.dataValues,
							status: 200
						};
					});
			} else {
				return Device.create(data)
					.then(function(instance) {
						return {
							body: instance.dataValues,
							status: 200
						};
					});
			}
		});
};


Device.belongsTo(Seller, {foreignKey: 'seller_id'});

module.exports = Device;
