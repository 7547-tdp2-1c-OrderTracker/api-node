var pusher = require('./services/pusher.js');
var regId= "some registration id"

//pusher.pushNewClientNotification(15,"Pablo, Lucadei","https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",[regId],console.log);
pusher.pushClientUpdatedNotification(15,"Pablo, Lucadei","https://cdn0.iconfinder.com/data/icons/avatars-6/500/Avatar_boy_man_people_account_player-128.png",[regId],console.log);
//pusher.pushNewPromotionNotification("2x1 en pijamas!",console.log);
//pusher.pushProductStockedNotification(19,"Pantalon Mujer Negra","http://pumaecom.scene7.com/is/image/PUMAECOM/568923_02_PNA?$PUMA_GRID$",console.log);
