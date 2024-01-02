import './App.css'
import Board from "./Board.jsx";
import RandomDice from "./RandomDice.jsx";
import {useReducer} from "react";
import {reducer} from "./Reducer.js";

function initBoard(dimension, color) {
    let arr = Array.from({length: dimension * dimension});
    return arr.map((t, index) => {
        return {
            x: Math.floor(index / dimension),
            y: Math.floor(index % dimension),
            visible: false,
            playerColor: color,
            card: 0
        };
    });
}
function App() {
    // Initialize the player's data
    const [state, dispatch] = useReducer(reducer,
        {
            card: 1,
            color: '#0b6c0b',
            board: [],
            isMyTurn: true
        },
        (initial) => {
            return {
                board: initBoard(6, initial.color),
                card: initial.card,
                color: initial.color,
                isMyTurn: initial.isMyTurn
            }
        });

    return (
    <div className="main">
      <Board state={state} dispatch={dispatch}/>
        <RandomDice state={state} dispatch={dispatch} />
    </div>
  )
}

export default App