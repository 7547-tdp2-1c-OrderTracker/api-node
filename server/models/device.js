var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var Seller = require("./seller");
var Push = require("../domain/push");

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
				return instance.update({seller_id: seller_id});
			} else {
				data.seller_id = seller_id;
				return Device.create(data)
					
			}
		})
		.then(function(instance) {
			return {
				body: instance.dataValues,
				status: 200
			};
		});;
};


var getRegToken = function(device) {
  return device.get("registration_token");
};

var getRegTokenArray = function(seller) {
  return seller.get("devices").map(getRegToken);
};

var concat = function(a1,a2) { return a1.concat(a2); };

Seller.push_notification = function(message, where) {
	var query = null;
	if (where) {
		query = Seller.findAll({where: where, include: [{model: Device}]})
	} else {
		query = Seller.findAll({include: [{model: Device}]})
	}

	return query
		.then(function(instances) {
			return instances.map(getRegTokenArray).reduce(concat,[]);
		})
		.then(function(regTokens) {
			console.log(regTokens);
			return Push.send(message, regTokens);
		});
};

Device.belongsTo(Seller, {foreignKey: 'seller_id'});
Seller.hasMany(Device, {foreignKey: 'seller_id'});

module.exports = Device;
