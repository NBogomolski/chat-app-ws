import express from 'express'
import cors from 'cors'
import http from 'http'
// for socket.io error handling
import {Server} from 'socket.io'
import {Message} from './types/Message'
// actual socket.io

const app = express();

app.use(cors());



const PORT = 5000

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);
    console.log(socket)
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`${socket.id} has joined room ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
        console.log(
            `${socket.id} with name ${data.author} has sent a message to room ${data.room}`
        );
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
