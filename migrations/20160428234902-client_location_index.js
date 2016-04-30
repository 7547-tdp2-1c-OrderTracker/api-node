'use strict';
var q = require("q");

module.exports = {
  up: function (queryInterface, Sequelize) {
    if (process.env.POSTGIS_DISABLED) {
      return q();
    }

    return queryInterface.sequelize.query("CREATE INDEX client_location_index ON clients USING GIST (location)");
  },

  down: function (queryInterface, Sequelize) {
    if (process.env.POSTGIS_DISABLED) {
      return q();
    }

    return queryInterface.sequelize.query("DROP INDEX client_location_index");
  }
};
