import express from 'express'
const app = express();
import cors from 'cors'
import http from 'http'
import {Server, Socket} from 'socket.io'


app.use(cors());



const PORT = 5000

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket: Socket) => {
    console.log(`${socket.id} has connected`);
    console.log(socket.data)

    socket.on("joinRoom", (data) => {
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
        io.emit('message', 'A user has left the chat')
    });
});

/* 
app.get("/", (req, res) => {
    res.send("Hello World!");
}); */

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
