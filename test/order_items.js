var app = require("../server.js");
var randomdbName = "ordertrackertest";

var db = require("./helpers/db")(randomdbName);
var api = require("./helpers/api")(app);
var expectations = require("./helpers/expectations");

var assert = require("assert");

var getReturned = function() { return this.returnedData; };

/*
	Testea las funcionalidades que involucran a order_items
	Pero se omite el testing de lo que ya se testea en test/orders.js

	Se crean clients y orders como parte del testing, pero no se verifican
*/

describe("Orders", function() {
	this.timeout(100000);
	before(function() {
		return db.create();
	});

	beforeEach(function() {
		var self = this;

		return db.reset()
			.then(function() {
				return api.post("/v1/clients", {
					name: 'test'
				}).then(function(res) {
					self.client_id = res.body.id;
				});
			});
	});
	describe("when create an order", function() {
		beforeEach(function() {
			var self = this;
			return api.post("/v1/orders", {client_id: this.client_id, vendor_id: 1})
						.then(function(res) {
							self.order_id = res.body.id;
						});
		});
		/***********************************************
		// TODO: test de insert de order items
		***********************************************/
	});
});


