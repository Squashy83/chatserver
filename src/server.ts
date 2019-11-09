require('dotenv').config();
let net = require('net');

import logger from './logger/logger';


let sockets: any[] = [];

let clientsCounter = 0;

let server = net.createServer(
    
    // New connection callback
    (socket:any) => {
	// Increment sockets counter
	clientsCounter++;
	
	socket.id = "client" + clientsCounter;
	let clientID = socket.id;

	sockets.push(socket);

	logger.info(`New user ${clientID} joined the chat`);

	// A new message from the client
	socket.on('data', function(data:any) {
		let message = data.toString();
		broadcast(clientID, message);

	});

	// Client ends connection
	socket.on('end', function() {
        logger.info(`User ${clientID} left the chat\n`);
		removeSocket(socket);
	});

	// When socket gets errors
	socket.on('error', function(error:any) {
        logger.error(`Socket error ${error.message}`);
	});
});


// Broadcast to other clients
function broadcast(from:any, message:any) {

    // No one left in the chat
	if (sockets.length === 0) {
		logger.info(`Not broadcasting...no one in the chat`);
		return;
	}

    //Someone is in the chat
	sockets.forEach(function(socket, index, array){
		// No message to the source client
        if(socket.nickname === from) return;
        
		socket.write(message);
	
	});
	
};


function removeSocket(socket:any) {
	sockets.splice(sockets.indexOf(socket), 1);
};


// In case of server errors
server.on('error', function(error:any) {
    logger.info(`Error in the server`);
});

export default server;



