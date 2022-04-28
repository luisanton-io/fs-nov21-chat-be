"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
let onlineUsers = [];
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/online-users', (req, res) => {
    res.send(onlineUsers);
});
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { /* options */});
io.on("connection", (socket) => {
    console.log(socket.id);
    console.log(socket.handshake.auth);
    socket.emit("welcome");
    socket.on("setUsername", ({ username }) => {
        console.log(username);
        onlineUsers.push({ username, socketId: socket.id });
        // How to emit an event to every other client socket
        socket.broadcast.emit("userJoined");
        socket.emit("didLogin");
    });
    socket.on("outgoingMessage", ({ message }) => {
        console.log(message);
        socket.broadcast.emit("incomingMessage", { message });
    });
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    });
});
httpServer.listen(3030, () => {
    console.log("listening on port 3030");
});
