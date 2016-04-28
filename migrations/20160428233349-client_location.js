'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("clients", "location", {type: Sequelize.GEOGRAPHY()});
 
 /*     .then(function() {
        return queryInterface.sequelize.query("CREATE INDEX brand_name_idx ON brands (name)");
      });*/
    
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("clients", "location", {type: Sequelize.GEOGRAPHY()});
    /*return queryInterface.sequelize.query("DROP INDEX brand_name_idx");
      .then(function() {
      });*/
  }
};
