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

let gameState = {
    users: [],
    playerColors: ['#c23f3f', '#0b6c0b', '#3e7da9', '#ef9c20'],
    turn: 0,
    board: []
};

io.on("connection", (socket) => {
    socket.on('new_connection', (arg) => {
        if (gameState.users.find(user => user.login === arg)) {
            console.log("A user with this name already exists");
            io.to(socket.id).emit('login_already_taken');
            socket.disconnect();
        }
        else {
            if (gameState.gameStarted) {
                io.to(socket.id).emit('no_more_space');
                socket.disconnect();
            }
            else {
                gameState.users.push({login: arg, socket: socket});
                socket.emit('assign_color', gameState.playerColors[gameState.users.length - 1]);
                gameState.gameStarted = (gameState.users.length === NUMBER_OF_PLAYERS);

                if (gameState.gameStarted) {
                    gameState.users.forEach(u => {
                        u.socket.emit('game_started');
                    });
                    io.to(gameState.users[0].socket.id).emit('set_player_turn');
                }
            }
        }
        console.log(gameState.users.map(u => u.login));
    });

    socket.on('played_turn', (arg) => {
        gameState.users.forEach(u => {
            if (socket.id !== u.socket.id) {
                io.to(u.socket.id).emit('other_player_played', arg);
            }
        })

        gameState.turn = (gameState.turn + 1) % NUMBER_OF_PLAYERS;
        io.to(gameState.users[gameState.turn].socket.id).emit('set_player_turn');
    });
});

server.listen(3000, () => {
    console.log('listening...');
});