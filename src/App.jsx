import './App.css'
import GamePage from "./GamePage.jsx";
import {useState} from "react";
import LoginPage from "./LoginPage.jsx";

function App() {
    const [login, setLogin] = useState('');
    const [logged, setLogged] = useState(false);

    return logged ? <GamePage login={login}/> :
        <LoginPage
            setLogged={setLogged}
            setLogin={setLogin}
        />;
}

export default App