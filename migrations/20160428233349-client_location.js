'use strict';
var q = require("q");

module.exports = {
  up: function (queryInterface, Sequelize) {
    if (process.env.POSTGIS_DISABLED) {
      return q();
    }

    return queryInterface.addColumn("clients", "location", {type: Sequelize.GEOGRAPHY('POINT', 4326)});
  },

  down: function (queryInterface, Sequelize) {
    if (process.env.POSTGIS_DISABLED) {
      return q();
    }

    return queryInterface.removeColumn("clients", "location");
  }
};
