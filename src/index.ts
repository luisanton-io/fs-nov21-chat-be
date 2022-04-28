import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app";
import Room from "./rooms/model";
import { shared } from "./shared";


const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


io.on("connection", (socket) => {
    console.log(socket.id)
    console.log(socket.handshake.auth)

    socket.emit("welcome")

    socket.on("setUsername", ({ username, room }) => {
        console.log(username)

        socket.join(room)

        shared.onlineUsers.push({ username, socketId: socket.id, room })

        // How to emit an event to every other client socket
        socket.broadcast.emit("userJoined")

        socket.emit("didLogin")
    })

    socket.on("outgoingMessage", async ({ message, room }) => {
        console.log(message, room)

        // here we will save the message to our database...
        await Room.findOneAndUpdate({ name: room }, { $push: { messages: message } })

        socket.to(room).emit("incomingMessage", { message })

    })

    socket.on("disconnect", () => {

        shared.onlineUsers = shared.onlineUsers.filter(user => user.socketId !== socket.id)
        console.log("DISCONNECTED", shared.onlineUsers, socket.id)

        socket.broadcast.emit("userLeft")
    })
});

mongoose.connect("mongodb://localhost/test-chat", () => {

    console.log("connected to mongo")
    httpServer.listen(3030, () => {
        console.log("listening on port 3030");
    });
})
