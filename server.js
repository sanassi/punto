import { Server } from "socket.io";
import { createServer } from 'vite';
import express from "express";
import http from "http";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app)

const vite = await createServer({
    server: {
        middlewareMode: true,
    },
    appType: 'custom',
});

app.use(vite.middlewares);

const io = new Server(server, {
        cors: {origin: "http://localhost:5173", methods: ["GET", "POST"]}
});
app.use(cors());

app.get('/', (req, res) => {
    // eslint-disable-next-line no-undef
    res.sendFile(__dirname + '/index.html');
});

const NUMBER_OF_PLAYERS = 4;
let users = [];
let gameStarted = false;
let turn = 0;

io.on("connection", (socket) => {
    socket.on('new_connection', (arg) => {
        if (users.find(user => user.login === arg)) {
            console.log("A user with this name already exists");
            io.to(socket.id).emit('login_already_taken');
            socket.disconnect();
        }
        else {
            if (gameStarted) {
                io.to(socket.id).emit('no_more_space');
                socket.disconnect();
            }
            else {
                users.push({login: arg, socket: socket});
                gameStarted = (users.length === NUMBER_OF_PLAYERS);

                if (gameStarted) {
                    users.forEach(u => {
                        u.socket.emit('game_started');
                    })
                }
            }
        }
        console.log(users.map(u => u.login));
    });

    socket.on('played_turn', (arg) => {
        console.log(arg);
        users.forEach(u => {
            if (socket.id !== u.socket.id) {
                io.to(u.socket.id).emit('other_player_played', arg);
            }
        })
    })
});

server.listen(3000, () => {
    console.log('listening...');
});