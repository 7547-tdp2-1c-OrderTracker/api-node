'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('visits', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      schedule_entry_id: {type: Sequelize.INTEGER},
      date: {type: Sequelize.DATE},
      comment: {type: Sequelize.STRING(511)},
      updated_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE}
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('visits');
  }
};
