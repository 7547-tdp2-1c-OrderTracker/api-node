'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("clients", "location", {type: Sequelize.GEOGRAPHY('POINT', 4326)});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("clients", "location");
  }
};
