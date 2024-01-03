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
    dimension: 6,
    playerColors: ['#c23f3f', '#0b6c0b', '#3e7da9', '#ef9c20'],
    turn: 0,
    board: []
};

gameState.board = Array.from({length: gameState.dimension * gameState.dimension});
gameState.board = gameState.board.map((t, index) => {
    return {
        x: Math.floor(index / gameState.dimension),
        y: Math.floor(index % gameState.dimension),
        played: false,
        playerColor: '',
        card: 0,
    }
})

function checkWin(color) {
    let won = false;

    const directions = [
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 1},
        { dx: -1, dy: -1}
    ];

    for (let i = 0; i < gameState.dimension; i++) {
        for (let j = 0; j < gameState.dimension; j++) {
            if (gameState.board[i * gameState.dimension + j].playerColor === color) {
                for (const direction of directions) {
                    const { dx, dy } = direction;
                    let count = 1;

                    for (let step = 1; step < 4; step++) {
                        const ni = i + step * dx;
                        const nj = j + step * dy;

                        if (ni >= 0 && ni < gameState.dimension && nj >= 0 && nj < gameState.dimension) {
                            if (gameState.board[ni * gameState.dimension + nj].playerColor === color) {
                                count++;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }

                    if (count === 4) {
                        won = true;
                        break;
                    }
                }
            }
        }
        if (won) {
            break;
        }
    }

    return won;
}


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
                const id = crypto.randomUUID();
                gameState.users.push({login: arg, socket: socket, id: id});
                socket.emit('assign_credentials', {
                    playerId: id,
                    playerColor: gameState.playerColors[gameState.users.length - 1]
                });

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
            if (arg.playerId !== u.id) {
                io.to(u.socket.id).emit('other_player_played', arg);
            }
        });

        let tile = gameState.board[arg.x * gameState.dimension + arg.y];
        tile.played = true;
        tile.playerColor = arg.color;
        tile.card = arg.card;

        const won = checkWin(arg.color);
        if (won) {
            let winner = gameState.users.find(u => u.socket.id === socket.id)[0];
            console.log(winner);
            console.log(`${winner.login} has won!`);

            io.to(winner.socket.id).emit('has_won');

            gameState.users.forEach(u => {
                if (u.socket.id !== winner.id) {
                    io.to(u.socket.id).emit('has_lost', winner.login);
                }
            })
        }

        gameState.turn = (gameState.turn + 1) % NUMBER_OF_PLAYERS;
        io.to(gameState.users[gameState.turn].socket.id).emit('set_player_turn');
    });
});

server.listen(3000, () => {
    console.log('listening...');
});