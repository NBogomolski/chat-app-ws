"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const http_1 = tslib_1.__importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = 5000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);
    console.log(socket);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`${socket.id} has joined room ${data}`);
    });
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
        console.log(`${socket.id} with name ${data.author} has sent a message to room ${data.room}`);
    });
    socket.on("disconnect", () => {
        console.log(`${socket.id} has disconnected`);
    });
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
