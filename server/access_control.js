var express = require("express");

module.exports = function(disabled) {
	return function(req, res, next) {
		if (disabled && !req.query.auth) return next();
		if (req.path === "/v1/auth/login") return next();

		if (req.authInfo) {
			if (req.authInfo.a) {
				// si es un admin, puede acceder a todo
				return next();
			}

			if (req.authInfo.s) {
				// si es un seller, puede leer todo
				if (req.method === "GET") return next();

				// y puede generar pedidos
				if (req.method === "POST" && req.path === "/v1/orders") return next();

				// y puede editar pedidos (esto incluye los items del pedido)
				if (req.method === "PUT" && req.path.startsWith("/v1/orders/")) return next();

				// y puede generar items de pedidos
				if (req.method === "POST" && req.path.match("/v1/orders/[0-9]+/order_items")) return next();

				// y puede borrar items de pedidos
				if (req.method === "DELETE" && req.path.match("/v1/orders/[0-9]+/order_items")) return next();

				// y puede generar visitas
				if (req.method === "POST" && req.path === "/v1/visits") return next();

				// y puede editar visitas
				if (req.method === "PUT" && req.path.startsWith("/v1/visits/")) return next();

				// y puede enviar scans de qr
				if (req.method === "POST" && req.path.startsWith("/v1/scanqr/")) return next();

			}
		}

		res.status(403).send({error: {key: 'FORBIDDEN', value: "No se puede acceder al recurso"}});
	};
};

