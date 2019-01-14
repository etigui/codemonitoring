module.exports.init = function (server) { 
    
    // External module dependencies
    var webSocketServer = require('ws').Server;

    // Vars
    var wss = new webSocketServer({server});

    // Init websocket server and handle incoming connect requests
    wss.on('connection', function (socket) {
        console.log("connection ...");
        
        // Handle message
        socket.on('message', function (message) {
            console.log('received: %s', message);
        });
        //wss.broadcast(JSON.stringify({msg: 'broadcast'}));
        socket.send('message from server at: ' + new Date());
    });

    // Broadcast message to all clients
    wss.broadcast = function (message) {
        wss.clients.forEach(function each(client) {
            client.send(message);
        });
    };

    // Broadcast message to all clients (except client who send init broadcast)
    wss.broadcastInit = function (message, clientExcept) {
        wss.clients.forEach(function each(client) {
            if(client.id !== clientExcept){
                client.send(message);
            }
        });
    };

    // Generate GUID
    wss.genGUID = function () {
        function guid() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return guid() + guid() + '-' + guid();
    };
};
