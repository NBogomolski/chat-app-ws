const express = require("express");
const app = express();
const http = require("http");
// so i can have socket.io
const cors = require("cors");
// for socket.io error handling
const { Server } = require("socket.io");
// actual socket.io

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);

    socket.on("joinRoom", (data) => {
        console.log(data)
        socket.join(data.room);
        console.log(`${socket.id} has joined room ${data.room}`); 
        io.emit("joinRoomActivated", {
            room: data.room,
            username: data.user,
            connected: Array.from(io.sockets.adapter.rooms.get(data.room)),
        });
    });

    socket.on("sendMessage", (data) => {
        socket.to(data.room).emit("receiveMessage", data);
        console.log(
            `${socket.id} with name ${data.username} has sent a message to room ${data.room}`
        );
    });
    socket.on("disconnect", () => {
        console.log(`${socket.id} has disconnected`);
    });
});

server.listen(5000, () => {
    console.log("Server is running");
});
