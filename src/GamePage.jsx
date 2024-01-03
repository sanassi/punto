import Board from "./Board.jsx";
import RandomDice from "./RandomDice.jsx";
import './GamePage.css';

export default function GamePage({ login, state, dispatch }) {
    return (
        <div className="main">
            <label className='login-label'>{login}</label>
            <Board state={state} dispatch={dispatch}/>
            <RandomDice state={state} dispatch={dispatch} />
        </div>
    )
}