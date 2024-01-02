import { Server } from "socket.io";

const io = new Server(3000, {
    // options
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    socket.emit("hello", "world");
});