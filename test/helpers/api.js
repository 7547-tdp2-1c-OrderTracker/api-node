var request = require("supertest");
var q = require("q");

module.exports = function(app) {
	var post = function(uri, postData) {
		var d = q.defer();
		request(app)
			.post(uri)
			.send(postData)
			.end(d.makeNodeResolver());

		return d.promise;
	};

	var get = function(uri) {
		var d = q.defer();
		request(app)
			.get(uri)
			.end(d.makeNodeResolver());

		return d.promise;
	};

	var put = function(uri, postData) {
		var d = q.defer();
		request(app)
			.put(uri)
			.send(postData)
			.end(d.makeNodeResolver());

		return d.promise;
	};

	var del = function(uri) {
		var d = q.defer();
		request(app)
			.del(uri)
			.end(d.makeNodeResolver());

		return d.promise;
	};

	return {
		post: post,
		get: get,
		put: put,
		del: del
	};
};


