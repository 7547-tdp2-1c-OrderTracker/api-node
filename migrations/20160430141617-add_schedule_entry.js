'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('schedule_entries', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      client_id: {type: Sequelize.INTEGER, references: {model: 'clients', key: 'id'}},
      seller_id: {type: Sequelize.INTEGER, references: {model: 'sellers', key: 'id'}},
      day_of_week: {type: Sequelize.INTEGER},
      updated_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE}
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('schedule_entries');
  }
};
