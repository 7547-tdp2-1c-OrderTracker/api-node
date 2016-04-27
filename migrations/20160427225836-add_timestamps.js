'use strict';


var tables = ['orders', 'clients', 'products', 'brands', 'order_entries'];
var fields = ['updated_at', 'created_at'];

module.exports = {
  up: function (queryInterface, Sequelize) {
    var pr;
    var addColumn = function(tableName, columnName, type) {
      return function() {
        return queryInterface.addColumn(tableName, columnName, type);
      };
    };

    tables.forEach(function(tableName) {
      fields.forEach(function(field) {
        if (pr) {
          pr = pr.then(addColumn(tableName, field, {type: Sequelize.DATE, defaultValue: Sequelize.NOW }));
        } else {
          pr = queryInterface.addColumn(tableName, field, {type: Sequelize.DATE, defaultValue: Sequelize.NOW });
        }
      });
    });

    return pr;
  },

  down: function (queryInterface, Sequelize) {
    var addColumn = function(tableName, columnName) {
      return function() {
        return queryInterface.removeColumn(tableName, columnName);
      };
    };

    tables.forEach(function(tableName) {
      fields.forEach(function(field) {
        if (pr) {
          pr = pr.then(removeColumn(tableName, field));
        } else {
          pr = queryInterface.removeColumn(tableName, field);
        }
      });
    });

    return pr;
  }
};
