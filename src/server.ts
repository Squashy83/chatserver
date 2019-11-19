require('dotenv').config();
import * as net from 'net';

import logger from './logger/logger';
import { Socket } from 'net';

//Better use a DB
const sockets: MySocket[] = [];

let clientsCounter = 0;

interface MySocket extends Socket {
	id?:string;
	nickname?:string;
}

const server = net.createServer(
    
    // New connection callback
    (socket:MySocket) => {
	// Increment sockets counter
	clientsCounter++;
	
	socket.id = "client" + clientsCounter;
	const clientID = socket.id;

	sockets.push(socket);

	logger.info(`New user ${clientID} joined the chat`);

	// A new message from the client
	socket.on('data', function(data) {
		const message = data.toString();
		broadcast(clientID, message);

	});

	// Client ends connection
	socket.on('end', function() {
        logger.info(`User ${clientID} left the chat\n`);
		removeSocket(socket);
	});

	// When socket gets errors
	socket.on('error', function(error) {
        logger.error(`Socket error ${error.message}`);
	});
});


// Broadcast to other clients
function broadcast(from:string, message:string) {

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


function removeSocket(socket:Socket) {
	sockets.splice(sockets.indexOf(socket), 1);
};


// In case of server errors
server.on('error', function(error) {
    logger.info(`Error in the server`);
});

export default server;



