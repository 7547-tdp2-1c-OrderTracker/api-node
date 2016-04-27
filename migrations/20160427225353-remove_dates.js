'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('orders','date_created');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('orders','date_created', Sequelize.DATE);
  }
};
