var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var sha1 = require("sha1");

var beforeCreateOrUpdate = function(instance, options) {
	sequelize.onlyAdmin(instance, options);

	if (options.fields.indexOf("password") !== -1) {
		instance.version = instance.version + 1;
		instance.password = sha1(instance.password);
	}
};

var Seller = sequelize.define('sellers', {
	name: {type: Sequelize.STRING},
	lastname: {type: Sequelize.STRING},
	avatar: {type: Sequelize.STRING},
	email: {type: Sequelize.STRING},
	phone_number: {type: Sequelize.STRING(32)},
	password: {type: Sequelize.STRING(255)},
	version: {type: Sequelize.INTEGER},
	date_created: {field: 'created_at', type: Sequelize.DATE},
	last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
	hooks: {
	    beforeUpdate: beforeCreateOrUpdate,
	    beforeCreate: beforeCreateOrUpdate,
  		beforeDestroy: sequelize.onlyAdmin
	},
	freezeTableName: true,
	updatedAt: 'last_modified',
	createdAt: 'date_created',
});

Seller.listRestriction = sequelize.sellerOwnRestriction;

module.exports = Seller;