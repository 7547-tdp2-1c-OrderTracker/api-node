var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var Seller = require("./seller");

var beforeUpdate = function(instance, options) {
  instance.location = {type: 'Point', coordinates: [instance.get('lat'), instance.get('lon')]};
};

var beforeCreate = function(instance, options) {
  instance.location = {type: 'Point', coordinates: [instance.get('lat'), instance.get('lon')]};
};

var Client = sequelize.define('clients', {
  name: Sequelize.STRING,
  lastname: Sequelize.STRING,
  avatar: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  cuil: Sequelize.STRING,
  address: Sequelize.STRING,
  phone_number: Sequelize.STRING,
  email: Sequelize.STRING,
  lat: Sequelize.REAL,
  lon: Sequelize.REAL,
  sellerType: {
  	type: Sequelize.STRING,
  	field: 'seller_type'
  },
  location: {type: Sequelize.GEOMETRY('POINT', 4326)},
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
}, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
  hooks: {
    beforeUpdate: beforeUpdate,
    beforeCreate: beforeCreate
  }
});

Client.belongsTo(Seller, {foreignKey: 'seller_id'})

module.exports = Client;