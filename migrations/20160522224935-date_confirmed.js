'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("orders", "date_confirmed", {type: Sequelize.DATE});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("orders", "date_confirmed");
  }
};
