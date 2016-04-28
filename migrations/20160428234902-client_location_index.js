'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("CREATE INDEX client_location_index ON clients USING GIST (location)");
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("DROP INDEX client_location_index");
  }
};
