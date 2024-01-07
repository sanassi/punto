import './App.css'
import GamePage from "./GamePage.jsx";
import {useEffect, useReducer, useState} from "react";
import LoginPage from "./LoginPage.jsx";
import {socket} from "../socket.js";
import {reducer} from "./Reducer.js";
import {initBoard, initCards} from "./Utils.js";

function App() {
    const [login, setLogin] = useState('');
    const [logged, setLogged] = useState(false);

    const [state, dispatch] = useReducer(reducer,
        {
            id: '',
            roomConfig: {},
            login: login,
            card: 1,
            color: '#0b6c0b',
            board: [],
            isMyTurn: false,
            remainingCards: [],
            otherPlayers: [],
            isFirst: false,
            dimension: 6,
            gameIsOn: true,
            currentPlayerPlaying: ''
        },
        (initial) => {
            let initialCards = initCards(6, 3);
            let firstCard = initialCards[initialCards.length - 1];
            initialCards.splice(-1);
            return {
                id: '',
                roomConfig: initial.roomConfig,
                login: initial.login,
                board: initBoard(6, initial.color),
                card: firstCard,
                color: initial.color,
                isMyTurn: initial.isMyTurn,
                remainingCards: initialCards,
                otherPlayers: initial.otherPlayers,
                isFirst: initial.isFirst,
                dimension: initial.dimension,
                gameIsOn: initial.gameIsOn,
                currentPlayerPlaying: initial.currentPlayerPlaying
            };
        });

    useEffect(() => {
        function onConnect() {
            console.log('loggedIn');
            setLogged(true);
            state.login = login
            socket.emit('new_connection', {
                login: login,
                roomConfig: state.roomConfig
            });
        }

        function onDisconnect() {
            console.log('disconnecting');
            setLogin('');
            socket.close();
            setLogged(false);
        }

        function onNoMoreSpace() {
            onDisconnect();
            alert('No more space, Loser!');
        }

        function onOtherPlayed(arg) {
            console.log(arg);
            dispatch({
                type: 'other_played_card', payload: arg
            });
        }

        function onAssignCredentials(arg) {
            console.log('arg:')
            console.log(arg);
            dispatch({
                type: 'assign_credentials',
                payload: arg
            });
        }

        function onSetMyTurn(arg) {
            dispatch({
                type: 'set_player_turn',
                payload: arg
            });
        }

        function onHasWon() {
            dispatch({
                type: 'has_won'
            });
        }

        function onHasLost(gameWinner) {
            dispatch({
                type: 'has_lost',
                payload: gameWinner
            });
        }

        function onOtherUserConnected(userLogin) {
            dispatch({
                type: 'other_user_connected',
                payload: userLogin
            })
        }

        function onResetGameValues() {
            dispatch({
                type: 'reset_game_values'
            })
        }

        function onGameStarted() {
            console.log('starting the game!');
        }

        function onRoomNotFound() {
            console.log('room not found.. :/');
            setLogged(false);
            setLogin('');
        }

        function onWaitingForOtherPlayerToPlay(arg) {
            console.log(arg);
            dispatch({
                type: 'waiting_for_player_to_play',
                payload: arg
            });
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('game_started', onGameStarted);
        socket.on('login_already_taken', onDisconnect);
        socket.on('no_more_space', onNoMoreSpace);
        socket.on('other_player_played', onOtherPlayed);
        socket.on('assign_credentials', onAssignCredentials);
        socket.on('set_player_turn', onSetMyTurn);
        socket.on('has_lost', onHasLost);
        socket.on('has_won', onHasWon);
        socket.on('other_user_connected', onOtherUserConnected);
        socket.on('reset_game_values', onResetGameValues);
        socket.on('room_not_found', onRoomNotFound);
        socket.on('waiting_for_player_to_play',
           onWaitingForOtherPlayerToPlay);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('game_started', onGameStarted);
            socket.off('login_already_taken', onDisconnect);
            socket.off('no_more_space', onNoMoreSpace);
            socket.off('other_player_played', onOtherPlayed);
            socket.off('assign_credentials', onAssignCredentials);
            socket.off('set_player_turn', onSetMyTurn);
            socket.off('has_lost', onHasLost);
            socket.off('has_won', onHasWon);
            socket.off('other_user_connected', onOtherUserConnected);
            socket.off('reset_game_values', onResetGameValues);
            socket.off('room_not_found', onRoomNotFound);
            socket.off('waiting_for_player_to_play',
               onWaitingForOtherPlayerToPlay);
        }
    }, [login, state]);

    return logged ? <GamePage login={login}
                              state={state}
                              dispatch={dispatch}/> :
        <LoginPage
            state={state}
            dispatch={dispatch}
            setLogged={setLogged}
            setLogin={setLogin}
        />;
}

export default App