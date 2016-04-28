var app, api;

var randomdbName = "ordertrackertest";

var db = require("./helpers/db")(randomdbName);
var expectations = require("./helpers/expectations");

var assert = require("assert");

var getReturned = function() { return this.returnedData; };
describe("clients", function() {
	this.timeout(100000);
	before(function() {
		this.set = function(name){
			var self = this;
			return function(value) {
				self[name] = value;
				return value;
			};
		};
		return db.create().then(function() {

			// hay q hacer el require despues de inicializar la base de prueba
 			app = require("../server.js");
			api = require("./helpers/api")(app);
		});
	});

	beforeEach(function() {
		return db.reset();
	});

	describe("when create new client (POST /v1/clients)", function() {
		beforeEach(function() {
			var self = this;
			return api.post("/v1/clients", {
				name: "Dario",
				lastname: "Seminara",
				sellerType: "retail",
				cuil: "20-XXXXXXXX-3",
				address: "Fake Street 123",
				phone_number: "1512345678",
				email: "user@domain.com",
				lat: 13,
				lon: 32
			})
			.then(this.set("returnedData"))
			.then(function(x) {
				self.client_id = x.body.id;
			});
		});

		expectations.responseShouldBe({
			status: 200,
			body: {
				name: "Dario",
				lastname: "Seminara",
				sellerType: "retail",
				cuil: "20-XXXXXXXX-3",
				address: "Fake Street 123",
				phone_number: "1512345678",
				email: "user@domain.com",
				lat: 13,
				lon: 32
			}
		}, getReturned);

		describe("when get the same client (GET /v1/clients/:id)", function() {
			beforeEach(function() {
				return api.get("/v1/clients/" + this.client_id).then(this.set("returnedData"));
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					name: "Dario",
					lastname: "Seminara",
					sellerType: "retail",
					cuil: "20-XXXXXXXX-3",
					address: "Fake Street 123",
					phone_number: "1512345678",
					email: "user@domain.com",
					lat: 13,
					lon: 32
				}
			}, getReturned);
		});

		describe("when put the same client (PUT /v1/clients/:id) with sellerType='wholesale'", function() {
			beforeEach(function() {
				return api.put("/v1/clients/" + this.client_id, {sellerType: 'wholesale'}).then(this.set("returnedData"));
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					sellerType: "wholesale",
				}
			}, getReturned);

			describe("when get the same client (GET /v1/clients/:id)", function() {
				beforeEach(function() {
					return api.get("/v1/clients/" + this.client_id).then(this.set("returnedData"));
				});

				expectations.responseShouldBe({
					status:200,
					body: {
						sellerType: "wholesale"
					}
				}, getReturned);
			});
		});

		describe("when put the same client (PUT /v1/clients/:id) with name='Pablo' and lastname: 'Lucadei'", function() {
			beforeEach(function() {
				return api.put("/v1/clients/" + this.client_id, {name: "Pablo", lastname: "Lucadei"}).then(this.set("returnedData"));
			});

			expectations.responseShouldBe({
				status:200,
				body: {
					name: "Pablo",
					lastname: "Lucadei",
					sellerType: "retail",
					cuil: "20-XXXXXXXX-3",
					address: "Fake Street 123",
					phone_number: "1512345678",
					email: "user@domain.com",
					lat: 13,
					lon: 32
				}
			}, getReturned);

			describe("when get the same client (GET /v1/clients/:id)", function() {
				beforeEach(function() {
					return api.get("/v1/clients/" + this.client_id).then(this.set("returnedData"));
				});

				expectations.responseShouldBe({
					status:200,
					body: {
						name: "Pablo",
						lastname: "Lucadei",
						sellerType: "retail",
						cuil: "20-XXXXXXXX-3",
						address: "Fake Street 123",
						phone_number: "1512345678",
						email: "user@domain.com",
						lat: 13,
						lon: 32
					}
				}, getReturned);
			});

		});

		describe("when delete client (DELETE /v1/clients/:id)", function() {
			beforeEach(function() {
				return api.del("/v1/clients/" + this.client_id).then(this.set("deleteReturned"));
			});

			expectations.responseShouldBe({
				status:204
			}, function() {return this.deleteReturned; });

			describe("when get list of clients (GET /v1/clients)", function() {
				beforeEach(function() {
					var self = this;
					return api.get("/v1/clients").then(function(r) {
						self.response = r;
					});
				});

				describe("paging", function() {
					it("should total 0", function() {
						assert.equal(this.response.body.paging.total, 0);
					});
				});

				describe("results", function() {
					describe("length", function() {
						it("should be 0", function() {
							assert.equal(this.response.body.results.length, 0);
						});
					});
				});
			});
		});

		describe("when get list of clients (GET /v1/clients)", function() {
			beforeEach(function() {
				var self = this;
				return api.get("/v1/clients").then(function(r) {
					self.response = r;
				});
			});

			describe("paging", function() {
				it("should total 1", function() {
					assert.equal(this.response.body.paging.total, 1);
				});
			});

			describe("results", function() {
				describe("length", function() {
					it("should be 1", function() {
						assert.equal(this.response.body.results.length, 1);
					});
				});

				expectations.shouldBe({
					name: "Dario",
					lastname: "Seminara",
					sellerType: "retail",
					cuil: "20-XXXXXXXX-3",
					address: "Fake Street 123",
					phone_number: "1512345678",
					email: "user@domain.com",
					lat: 13,
					lon: 32
				}, function() { return this.response.body.results[0]; });
			});
		});
	});
});
