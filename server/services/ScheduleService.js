var pg = require('pg');
var conString = 'postgres://vlrunzhodjfzpy:OvEplup8u9A7aFjs8ExOY6dd14@ec2-54-163-254-231.compute-1.amazonaws.com:5432/dq8shn8n7e78h' //process.env.DATABASE_URL;
pg.connect(conString, function(err, client, done) {}

		/*
		FORMATO ERROR
		{
		status: 40X,
		cause: { error:
				value:
			}
		}
		*/
		function createSchedule(seller_id, week, callback) {
			pg.connect(conString, function(err, client, done) {
				if (err) {
					callback({
						status: 500,
						cause: {
							error: "DB_CONNECTION_ERROR",
							value: "Can not connecto to DataBase. " + err
						}
					})
				} else {
					client.query('INSERT INTO schedule (seller_id,week,last_updated) values ($1::int, EXTRACT(WEEK FROM CURRENT_TIMESTAMP), CURRENT_TIMESTAMP)', [seller_id], function(err, result) {
						done();
						if (err) {
							callback({
								status: 500,
								cause: {
									error: "DB_ERROR",
									value: "Can not insert schedule into DataBasese. " + err
								}
							})
						} else {
							callback(undefined, result.rows[0]);
						}
					});
				}
			});
		};

		function addAssignments(schedule_id, client_id, day, hour, callback) {
			callback(undefined, {
				id: 1,
				seller_id: 1,
				week: 23,
				last_updated: new Date(),
				assignments: [{
					id: 1,
					client_id: 1,
					day: "MONDAY",
					hour: "10:45",
					visited: false
				}]
			});
		};

		function removeAssignments(schedule_id, assignments_id, callback) {
			callback(undefined, {
				id: 1,
				seller_id: 1,
				week: 23,
				last_updated: new Date(),
				assignments: [{
					id: 1,
					client_id: 1,
					day: "MONDAY",
					hour: "10:45",
					visited: false
				}]
			});
		};

		function setAssignmentsAsVisited(schedule_id, assignments_id, visited, callback) {
			callback(undefined, {
				id: 1,
				seller_id: 1,
				week: 23,
				last_updated: new Date(),
				assignments: [{
					id: 1,
					client_id: 1,
					day: "MONDAY",
					hour: "10:45",
					visited: false
				}]
			});
		};

		function getCurrentSchedule(callback) {
			callback(undefined, {
				id: 1,
				seller_id: 1,
				week: 23,
				last_updated: new Date(),
				assignments: [{
					id: 1,
					client_id: 1,
					day: "MONDAY",
					hour: "10:45",
					visited: false
				}]
			});
		};

		function getScheduleById(schedule_id, callback) {
			callback(undefined, {
				id: 1,
				seller_id: 1,
				week: 23,
				last_updated: new Date(),
				assignments: [{
					id: 1,
					client_id: 1,
					day: "MONDAY",
					hour: "10:45",
					visited: false
				}]
			});
		};


		module.exports.createSchedule = createSchedule; module.exports.addAssignments = addAssignments; module.exports.removeAssignments = removeAssignments; module.exports.setAssignmentsAsVisited = setAssignmentsAsVisited; module.exports.getCurrentSchedule = getCurrentSchedule; module.exports.getScheduleById = getScheduleById;