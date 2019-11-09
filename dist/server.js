"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
let net = require('net');
const logger_1 = require("./logger/logger");
let sockets = [];
let clientsCounter = 0;
let server = net.createServer(
// New connection callback
(socket) => {
    // Increment sockets counter
    clientsCounter++;
    socket.id = "client" + clientsCounter;
    let clientID = socket.id;
    sockets.push(socket);
    logger_1.default.info(`New user ${clientID} joined the chat`);
    // A new message from the client
    socket.on('data', function (data) {
        let message = data.toString();
        broadcast(clientID, message);
    });
    // Client ends connection
    socket.on('end', function () {
        logger_1.default.info(`User ${clientID} left the chat\n`);
        removeSocket(socket);
    });
    // When socket gets errors
    socket.on('error', function (error) {
        logger_1.default.error(`Socket error ${error.message}`);
    });
});
// Broadcast to other clients
function broadcast(from, message) {
    // No one left in the chat
    if (sockets.length === 0) {
        logger_1.default.info(`Not broadcasting...no one in the chat`);
        return;
    }
    //Someone is in the chat
    sockets.forEach(function (socket, index, array) {
        // No message to the source client
        if (socket.nickname === from)
            return;
        socket.write(message);
    });
}
;
function removeSocket(socket) {
    sockets.splice(sockets.indexOf(socket), 1);
}
;
// In case of server errors
server.on('error', function (error) {
    logger_1.default.info(`Error in the server`);
});
exports.default = server;
//# sourceMappingURL=server.js.map