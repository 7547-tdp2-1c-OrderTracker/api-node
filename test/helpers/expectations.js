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

var hasKeys = function(value, expected) {
	Object.keys(expected).forEach(function(key) {
		if (expected[key] && typeof expected[key] === "object") {
			hasKeys(value[key], expected[key]);
		} else {
			assert.equal(JSON.stringify(value[key]), JSON.stringify(expected[key]));
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
			hasKeys(this.obj, obj);
		});
	});

};

module.exports = {
	responseShouldBe: responseShouldBe,
	shouldBe: shouldBe
};
