var Sequelize = require("sequelize");
var seq = new Sequelize(process.env.DATABASE_URL);

seq.checkAllowed = function(allowedFields, options) {
	allowedFields.push("updated_at");
	allowedFields.push("created_at");

	var rejected = function(field) {
		return allowedFields.indexOf(field) === -1;
	};
	var prohibited = options.fields.filter(rejected);
	if (prohibited.length) {
		throw {error: {key: 'REJECTED_FIELD_UPDATE', value: 'no se puede actualizar el valor del campo \'' + prohibited[0]  +'\''}, status: 400};
	}
};

module.exports = seq;
