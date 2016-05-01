var Sequelize = require("sequelize");
var sequelize = require("../domain/sequelize");
var md5 = require("md5");

var gravatarBaseUrl = "http://www.gravatar.com/avatar/";
var getGravatar = function(instance, size) {
  var url = gravatarBaseUrl + md5(instance.get("email")) + "?d=mm"
  if (size) {
    url = url + "&size=" + size;
  }
  return url;
};

var rewriteUrl = function(url) {
  if (!url) return true;
  return url.startsWith(gravatarBaseUrl);
};

var writeUrl = function(url) {
  if (!url) return true;
  return !url.startsWith("http");
};

var beforeUpdate = function(instance, options) {
  if (options.fields.indexOf("email") != -1) {
    if (rewriteUrl(instance.thumbnail) || rewriteUrl(instance.avatar)) {
      instance.thumbnail = getGravatar(instance, 32);
      instance.avatar = getGravatar(instance)
    }
  }

  instance.location = {type: 'Point', coordinates: [instance.get('lat'), instance.get('lon')]};
};

var beforeCreate = function(instance, options) {
  if (writeUrl(instance.thumbnail) || writeUrl(instance.avatar)) {
    instance.thumbnail = getGravatar(instance, 32);
    instance.avatar = getGravatar(instance)
  }

  instance.location = {type: 'Point', coordinates: [instance.get('lat'), instance.get('lon')]};
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
    field: 'seller_type'
  },
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
    beforeCreate: beforeCreate
  }
});

module.exports = Client;