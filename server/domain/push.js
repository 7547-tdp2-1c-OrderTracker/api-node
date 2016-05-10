var gcm = require("node-gcm");
var q = require("q");
var push_notification_config = require("../../config/push_notification.json");
var _ = require("underscore");

var send = function(data, devices) {
	var message = new gcm.Message();
	for (var k in data) {
		message.addData(k, data[k]);
	}

	var sender = new gcm.Sender(push_notification_config.api_key);
	var senderSend = q.denodeify(sender.send.bind(sender));
	var device_ids = devices.map(_.property("device_id"));

	// TODO
	console.log("TODO: enviar push a " + device_ids);
	//return senderSend(message, {registrationTokens: registrationTokens});
};

module.exports = {
	send: send
};