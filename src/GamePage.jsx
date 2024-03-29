import Board from "./Board.jsx";
import RandomDice from "./RandomDice.jsx";
import './GamePage.css';
import PlayersDisplay from "./PlayersDisplay.jsx";
import PlayAgainButton from "./PlayAgainButton.jsx";

export default function GamePage({ login, state, dispatch }) {
    return (
        <div className='game-page'>
            <div className="game-view">
                <PlayersDisplay state={state}/>
                <label className='login-label'>{login}</label>
                <Board state={state} dispatch={dispatch}/>
                <RandomDice state={state} dispatch={dispatch} />
                <PlayAgainButton state={state} dispatch={dispatch}/>
            </div>
        </div>
    )
}