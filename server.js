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


let rooms = {};

/*
const NUMBER_OF_PLAYERS = 4;
let gameRoom = {
    users: [],
    dimension: 6,
    playerColors: ['#c23f3f', '#0b6c0b', '#3e7da9', '#ef9c20'],
    turn: 0,
    board: [],
    numberOfPlayers: 2
};
 */

function initGameBoard(gameRoom) {
    gameRoom.board = Array.from({length: gameRoom.dimension * gameRoom.dimension});
    gameRoom.board = gameRoom.board.map((t, index) => {
        return {
            x: Math.floor(index / gameRoom.dimension),
            y: Math.floor(index % gameRoom.dimension),
            played: false,
            playerColor: '',
            card: 0,
        }
    })
}

function generateRoomKey() {
    return Math.random().toString(36).slice(4).toUpperCase();
}

function checkWin(gameRoom, color) {
    let won = false;

    const directions = [
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 1},
        { dx: -1, dy: -1}
    ];

    for (let i = 0; i < gameRoom.dimension; i++) {
        for (let j = 0; j < gameRoom.dimension; j++) {
            if (gameRoom.board[i * gameRoom.dimension + j].playerColor === color) {
                for (const direction of directions) {
                    const { dx, dy } = direction;
                    let count = 1;

                    for (let step = 1; step < 4; step++) {
                        const ni = i + step * dx;
                        const nj = j + step * dy;

                        if (ni >= 0 && ni < gameRoom.dimension && nj >= 0 && nj < gameRoom.dimension) {
                            if (gameRoom.board[ni * gameRoom.dimension + nj].playerColor === color) {
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
        const targetRoomId = arg.roomConfig.room;
        const playerLogin = arg.login;

        const targetRoom = rooms[targetRoomId];

        const loginAlreadyTaken = targetRoom !== undefined &&
            targetRoom.users.find(user => user.login === playerLogin);

        if (loginAlreadyTaken) {
            io.to(socket.id).emit('login_already_taken');
            socket.disconnect();
        }
        else {
            const roomIsFull = targetRoom !== undefined && targetRoom.gameStarted;
            if (roomIsFull) {
                io.to(socket.id).emit('no_more_space');
                socket.disconnect();
            }
            else {
                console.log(arg);
                const id = crypto.randomUUID();

                let roomId;
                if (arg.roomConfig.type === 'create_room') {
                    roomId = generateRoomKey();
                    rooms[roomId] = {
                        roomId: roomId,
                        users: [],
                        dimension: 6,
                        playerColors: ['#c23f3f', '#0b6c0b', '#3e7da9', '#ef9c20'],
                        turn: 0,
                        board: [],
                        numberOfPlayers: Number(arg.roomConfig.numberOfPlayers)
                    }
                }
                else {
                    const roomExists = Object.hasOwn(rooms, arg.roomConfig.room);
                    if (!roomExists) {
                        socket.emit('room_not_found');
                        socket.disconnect();
                        return;
                    }
                    roomId = arg.roomConfig.room;
                }
                const newUser = {login: arg.login, socket: socket, id: id, room: roomId};

                newUser.socket.join(roomId);
                let targetRoom = rooms[newUser.room];
                targetRoom.users.push(newUser);
                console.log(rooms);

                socket.emit('assign_credentials', {
                    playerId: id,
                    playerColor: targetRoom.playerColors[targetRoom.users.length - 1],
                    alreadyConnected: targetRoom.users.slice(0, -1).map(u => u.login),
                    roomConfig: {type: arg.roomConfig.type, room: roomId}
                });

                targetRoom.users.forEach(u => {
                    if (u.id !== newUser.id) {
                        io.to(u.socket.id).emit('other_user_connected', newUser.login);
                    }
                })

                targetRoom.gameStarted = (targetRoom.users.length === targetRoom.numberOfPlayers);

                if (targetRoom.gameStarted) {
                    initGameBoard(targetRoom);
                    io.to(targetRoom.roomId).emit('game_started');
                    io.to(targetRoom.users[0].socket.id)
                        .emit('set_player_turn', { isFirst: true });
                }
            }
        }
        if (targetRoom !== undefined)
            console.log(targetRoom.users.map(u => {
                return { login: u.login, id: u.id, room: u.room };
            }));
    });

    socket.on('played_turn', (arg) => {
        const room = rooms[arg.room];
        room.users.forEach(u => {
            if (arg.playerId !== u.id) {
                io.to(u.socket.id).emit('other_player_played', arg);
            }
        });

        let tile = room.board[arg.x * room.dimension + arg.y];
        tile.played = true;
        tile.playerColor = arg.color;
        tile.card = arg.card;

        const won = checkWin(room, arg.color);
        if (won) {
            let winner = room.users.find(u => u.id === arg.playerId.toString());
            io.to(winner.socket.id).emit('has_won');

            room.users.forEach(u => {
                if (u.id !== winner.id) {
                    io.to(u.socket.id).emit('has_lost', winner.login);
                }
            })

            room.gameStarted = false;
        }
        else {
            room.turn = (room.turn + 1) % room.numberOfPlayers;
            io.to(room.users[room.turn].socket.id)
                .emit('set_player_turn', { isFirst: false });
        }
    });

    socket.on('prepare_for_new_game', (arg) => {
        let room = rooms[arg.room];
        initGameBoard(room);
        room.turn = 0;
        room.gameStarted = true;
        io.emit('reset_game_values');
        room.users.forEach(u => {
            u.socket.emit('game_started');
        });
        io.to(room.users[0].socket.id)
            .emit('set_player_turn', { isFirst: true });
    });
});

server.listen(3000, () => {
    console.log('listening...');
});