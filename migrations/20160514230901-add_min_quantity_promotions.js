'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("promotions", "min_quantity", {type: Sequelize.INTEGER, defaultValue: 0});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("promotions", "min_quantity");
  }
};
