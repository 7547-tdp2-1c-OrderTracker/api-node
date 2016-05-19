var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");

var Seller = sequelize.define('sellers', {
	name: {type: Sequelize.STRING},
	lastname: {type: Sequelize.STRING},
	avatar: {type: Sequelize.STRING},
	email: {type: Sequelize.STRING},
	phone_number: {type: Sequelize.STRING(32)},
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

Seller.listRestriction = sequelize.sellerOwnRestriction;

module.exports = Seller;