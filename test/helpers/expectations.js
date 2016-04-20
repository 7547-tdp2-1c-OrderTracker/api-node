var assert = require("assert");
var q = require("q");

var responseShouldBe = function(options, element) {
	describe("returned", function() {
		beforeEach(function() {
			var self = this;
			return q(element.bind(this)()).then(function(x) {
				self.obj = x;
			});
		});

		describe("status", function() {
			it("should be " + options.status, function() {
				assert.equal(this.obj.status, options.status);
			});
		});

		if (options.body) {
			shouldBe(options.body, function() {
				return q(element.bind(this)()).then(function(x) {
					return x.body;
				});
			}, "body");
		}
	});

};

var shouldBe = function(obj, element, name) {
	describe(name || "obj", function() {
		beforeEach(function() {
			var self = this;
			return q(element.bind(this)()).then(function(x) {
				self.obj = x;
			});
		});

		it("should have " + JSON.stringify(obj), function() {
			var self = this;
			Object.keys(obj).forEach(function(key) {
				assert.equal(self.obj[key], obj[key]);
			});
		});
	});

};

module.exports = {
	responseShouldBe: responseShouldBe,
	shouldBe: shouldBe
};
