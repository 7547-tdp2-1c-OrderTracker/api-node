'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex(
      'schedule_entries', 
      ['day_of_week', 'client_id'], 
      {indexName: 'reject_dup_seller_client_day', indicesType: 'UNIQUE'});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('schedule_entries', 'reject_dup_seller_client_day');
  }
};
