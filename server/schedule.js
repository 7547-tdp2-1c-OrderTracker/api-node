var express = require('express');
var router = express.Router();
var scheduleService = require('./services/ScheduleService.js');

/*
Crear Schedule
{
	“seller_id”:
	“week”:
}
*/
router.use(function(req, res, next) {
	res.set('Content-Type', 'application/json');
	next();
});

router.post('/', function(req, res) {
	if (!req.body.seller_id || !req.body.week) {
		res.status(400).send({
			error: 'MISSING_PARAMETERS',
			value: 'Missing seller_id or week parameter.'
		})
	} else {
		scheduleService.createSchedule(req.body.seller_id, req.body.week, function(error, schedule) {
			if (error) {
				res.status(400).send(error);
			} else {
				res.status(201).send(schedule);
			}
		});
	}
});

/* Agregar visita
{
	client_id:
	day:
	hour:
}
*/
router.post('/:schedule_id/assignments', function(req, res) {
	if (!req.body.client_id || !req.body.day || !req.body.hour) {
		res.status(400).send({
			error: 'MISSING_PARAMETERS',
			value: 'Missing client_id, day or hour parameter.'
		})
	} else {
		var schedule_id = req.params.schedule_id;
		scheduleService.addAssignments(schedule_id, req.body.client_id, req.body.day, req.body.hour, function(error, schedule) {
			if (error) {
				res.status(error.status).send(error.cause);
			} else {
				res.status(201).send(schedule);
			}
		});
	}
});


// Cancelar visita
router.delete('/:schedule_id/assignments/:assignments_id', function(req, res) {
	var schedule_id = req.params.schedule_id;
	var assignments_id = req.params.assignments_id;
	scheduleService.removeAssignments(schedule_id, assignments_id, function(error, schedule) {
		if (error) {
			res.status(error.status).send(error.cause);
		} else {
			res.status(200).send(schedule);
		}
	});
});

/* Marcar visita
{
	visited:true;
}
*/
router.put('/:schedule_id/assignments/:assignments_id', function(req, res) {
	if (!req.body.visited) {
		res.status(400).send({
			error: 'MISSING_PARAMETERS',
			value: 'Missing visited parameter.'
		})
	} else {
		var schedule_id = req.params.schedule_id;
		var assignments_id = req.params.assignments_id;
		scheduleService.setAssignmentsAsVisited(schedule_id, assignments_id, params.body.visited.toUpperCase() == "TRUE", function(error, schedule) {
			if (error) {
				res.status(error.status).send(error.cause);
			} else {
				res.status(200).send(schedule);
			}
		});
	}
});

// Calendario en curso
router.get('/current', function(req, res) {
	scheduleService.getCurrentSchedule(function(error, schedule) {
		if (error) {
			res.status(error.status).send(error.cause);
		} else {
			res.status(200).send(schedule);
		}
	});
});

// Calendario particular
router.get('/:schedule_id', function(req, res) {
	var schedule_id = req.params.schedule_id;
	scheduleService.getScheduleById(schedule_id,function(error, schedule) {
		if (error) {
			res.status(error.status).send(error.cause);
		} else {
			res.status(200).send(schedule);
		}
	});
});

module.exports = router