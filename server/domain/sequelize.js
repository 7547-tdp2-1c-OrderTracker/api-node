var Sequelize = require("sequelize");
var seq = new Sequelize(process.env.DATABASE_URL);

seq.checkAllowed = function(allowedFields, options) {
	allowedFields.push("date_created");
	allowedFields.push("last_modified");

	var rejected = function(field) {
		return allowedFields.indexOf(field) === -1;
	};
	var prohibited = options.fields.filter(rejected);
	if (prohibited.length) {
		throw {error: {key: 'REJECTED_FIELD_UPDATE', value: 'no se puede actualizar el valor del campo \'' + prohibited[0]  +'\''}, status: 400};
	}
};

seq.onlyAdmin = function(instance, options, msg) {
	if (!options.authInfo) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};
	if (!options.authInfo.admin) {
       	throw {error: {key: 'FORBIDDEN', value: msg||'solo el administrador puede actualizar esto'}, status: 403};
	}
};

seq.onlySeller = function(instance, options, msg) {
	if (!options.authInfo) throw {error: {key: 'MISSING_AUTH', value: 'no se autentico'}, status: 401};
	if (!options.authInfo.admin) {
		if (options.authInfo.seller_id != instance.get("seller_id")) {
	       	throw {error: {key: 'FORBIDDEN', value: msg||'solo el administrador o el vendedor asociado puede actualizar esto'}, status: 403};
		}
	}
};

seq.sellerListRestriction = function(authInfo) {
  if (authInfo.admin) return {};
  return {seller_id: authInfo.seller_id};
};

seq.sellerOwnRestriction = function(authInfo) {
  if (authInfo.admin) return {};
  return {id: authInfo.seller_id};
};

module.exports = seq;
