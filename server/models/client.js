var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var q = require("q");
var _ = require("underscore");

var push = q.denodeify(require("../domain/push").pushClientUpdatedNotification);

var ScheduleEntry;
var beforeUpdate = function(instance, options) {
  // sequelize no acepta los require circulares y schedule entry hace require client.js
  if (!ScheduleEntry) ScheduleEntry = require("./schedule_entry");
  if (!options.authInfo) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};

  return q()
    .then(function() {
      if (!options.authInfo.admin) {
        if (!options.authInfo.seller_id) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};
        
        return ScheduleEntry.findOne({where: {client_id: instance.get("id"), seller_id: options.authInfo.seller_id}})
          .then(function(se) {
            if (!se) {
              throw {error: {key: 'FORBIDDEN', value: 'el vendedor no esta asociado a ese cliente'}, status: 401};
            }
          });
      }
    })
    .then(function() {
      if (options.fields.indexOf("avatar") != -1) {
        instance.thumbnail = instance.avatar;
      }
      instance.location = {type: 'Point', coordinates: [instance.get('lat'), instance.get('lon')]};
    });
};

var beforeCreate = function(instance, options) {
  // sequelize no acepta los require circulares y schedule entry hace require client.js
  if (!ScheduleEntry) ScheduleEntry = require("./schedule_entry");
  if (!options.authInfo) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};

  return q()
    .then(function() {
      if (!options.authInfo.admin) {
        if (!options.authInfo.seller_id) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};
        
        return ScheduleEntry.findOne({where: {client_id: instance.get("id"), seller_id: options.authInfo.seller_id}})
          .then(function(se) {
            if (!se) {
              throw {error: {key: 'FORBIDDEN', value: 'el vendedor no esta asociado a ese cliente'}, status: 401};
            }
          });
      }
    })
    .then(function() {
      instance.location = {type: 'Point', coordinates: [instance.get('lat'), instance.get('lon')]};
    });
};

var afterUpdate = function(instance, options) {
  if (
      options.fields.indexOf("lat") !== -1 ||
      options.fields.indexOf("lon") !== -1 ||
      options.fields.indexOf("location") !== -1 ||
      options.fields.indexOf("cuil") !== -1) {

    // esta query obtiene los registration_ids de todos los devices correspondientes a todos los vendedores 
    // asociados al cliente que se esta modificando
    var devicesQuery = "select distinct d.registration_id from devices as d join sellers as s on d.seller_id = s.id join schedule_entries as se on s.id = se.seller_id where se.client_id = ?";
    return sequelize.query(devicesQuery, {replacements: [instance.get("id")]})
      .then(function(result) {
        var tokens = result[0].map(_.property("registration_id"));
        return push(instance.get("id"), instance.get("name"), instance.get("lastname"), instance.get("thumbnail"), tokens);
      })
      .catch(console.error.bind(console));
  }
};

var clientDefinition = {
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
    field: 'seller_type',
    validate: {
      isIn: [['wholesale', 'retail']]
    }
  },
  company: Sequelize.STRING,
  date_created: {field: 'created_at', type: Sequelize.DATE},
  last_modified: {field: 'updated_at', type: Sequelize.DATE}
};

if (!process.env.POSTGIS_DISABLED) {
  clientDefinition.location = {type: Sequelize.GEOMETRY('POINT', 4326)};
}

var Client = sequelize.define('clients', clientDefinition, {
  freezeTableName: true,
  updatedAt: 'last_modified',
  createdAt: 'date_created',
  hooks: {
    beforeUpdate: beforeUpdate,
    beforeCreate: beforeCreate,
    afterUpdate: afterUpdate
  }
});

module.exports = Client;