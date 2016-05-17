'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('configs', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      client_max_distance: {type: Sequelize.INTEGER, defaultValue: 300},
      updated_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE}
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('configs');
  }
};
