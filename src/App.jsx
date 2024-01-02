import './App.css'
import Board from "./Board.jsx";
import RandomDice from "./RandomDice.jsx";
import {getRandomIntInclusive} from "./Utils.js";

function reducer(state, action) {
    if (action.type === 'select_new_card') {
        let number = getRandomIntInclusive(1, 6);
        return {
            card: number
        };
    }

    throw Error('Unknown action.');
}
function App() {
  return (
    <div className="main">
      <Board/>
        <RandomDice face={5} color={'#b20a0a'}/>
    </div>
  )
}

export default App