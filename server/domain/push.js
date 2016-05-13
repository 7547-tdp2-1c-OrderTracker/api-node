var gcm = require('node-gcm');
var push_notification_config = require("../../config/push_notification.json");
var sender = new gcm.Sender(push_notification_config.api_key);

function pushNewClientNotification(client_id,client_name,pictureURL,tokens,callback){
	var message = new gcm.Message();
	message.addData('type', 'NEW_CLIENT');
	message.addData('identifier',client_id);
	message.addData('message',client_name);
	message.addData('picture',pictureURL);
	
	sender.send(message, { registrationTokens: tokens }, function (err, response) {
	    if(err)
	    	console.error(err);
	    else
	    	console.log(response);

	    callback(err);
	});
}

function pushClientUpdatedNotification(client_id,client_name,pictureURL,tokens,callback){
	var message = new gcm.Message();
	message.addData('type', 'CLIENT_UPDATED');
	message.addData('identifier',client_id);
	message.addData('message',client_name);
	message.addData('picture',pictureURL);
	
	sender.send(message, { registrationTokens: tokens }, function (err, response) {
	    if(err)
	    	console.error(err);
	    else
	    	console.log(response);

	    callback(err);
	});
}

function pushNewPromotionNotification(promotion_id,promotion_name,callback){
	var message = new gcm.Message();
	message.addData('type', 'NEW_PROMOTION');
	message.addData('identifier',promotion_id);
	message.addData('message',promotion_name);
	
	sender.sendNoRetry(message, { topic: '/topics/promotions' }, function (err, response) {
     if(err)
	    	console.error(err);
	 else
	    	console.log(response);

	 callback(err);
	});
}

function pushProductStockedNotification(product_id,product_name,pictureURL,callback){
	var message = new gcm.Message();
	message.addData('type', 'PRODUCT_STOCKED');
	message.addData('identifier',product_id);
	message.addData('message',product_name);
	message.addData('picture',pictureURL);

	sender.sendNoRetry(message, { topic: '/topics/promotions' }, function (err, response) {
     if(err)
	    	console.error(err);
	 else
	    	console.log(response);

	 callback(err);
	});
}

module.exports.pushNewClientNotification= pushNewClientNotification;
module.exports.pushClientUpdatedNotification= pushClientUpdatedNotification;
module.exports.pushNewPromotionNotification= pushNewPromotionNotification;
module.exports.pushProductStockedNotification= pushProductStockedNotification;
