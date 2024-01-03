import './App.css'
import GamePage from "./GamePage.jsx";
import {useEffect, useState} from "react";
import LoginPage from "./LoginPage.jsx";
import {socket} from "../socket.js";

function App() {
    const [login, setLogin] = useState('');
    const [logged, setLogged] = useState(false);

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

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('login_already_taken', onDisconnect);
        socket.on('no_more_space', onNoMoreSpace);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('login_already_taken', onDisconnect);
            socket.off('no_more_space', onNoMoreSpace);
        }
    }, [login]);

    return logged ? <GamePage login={login}/> :
        <LoginPage
            setLogged={setLogged}
            setLogin={setLogin}
        />;
}

export default App