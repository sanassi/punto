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
            card: 1,
            color: '#0b6c0b',
            board: [],
            isMyTurn: false,
            remainingCards: []
        },
        (initial) => {
            let initialCards = initCards(6, 3);
            let firstCard = initialCards[initialCards.length - 1];
            initialCards.splice(-1);
            return {
                board: initBoard(6, initial.color),
                card: firstCard,
                color: initial.color,
                isMyTurn: initial.isMyTurn,
                remainingCards: initialCards
            };
        });

    useEffect(() => {
        function onConnect() {
            console.log('loggedIn');
            setLogged(true);
            socket.emit('new_connection', login);
        }

        function onDisconnect() {
            console.log('disconnecting');
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

        function onAssignColor(arg) {
            dispatch({
                type: 'assign_color',
                payload: arg
            });
        }

        function onSetMyTurn() {
            dispatch({
                type: 'set_player_turn'
            });
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('login_already_taken', onDisconnect);
        socket.on('no_more_space', onNoMoreSpace);
        socket.on('other_player_played', onOtherPlayed);
        socket.on('assign_color', onAssignColor);
        socket.on('set_player_turn', onSetMyTurn);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('login_already_taken', onDisconnect);
            socket.off('no_more_space', onNoMoreSpace);
            socket.off('other_player_played', onOtherPlayed);
            socket.off('assign_color', onAssignColor);
            socket.off('set_player_turn', onSetMyTurn);

        }
    }, [login]);

    return logged ? <GamePage login={login}
                              state={state}
                              dispatch={dispatch}/> :
        <LoginPage
            setLogged={setLogged}
            setLogin={setLogin}
        />;
}

export default App