import Dice from "./Dice.jsx";
import './RandomDice.css';
import {getRandomIntInclusive} from "./Utils.js";

export default function RandomDice({ state, dispatch }) {
    return (
        <div className="random-dice">
            <Dice face={state.card}
                  color={state.color}
                  visible={true}
            />
        </div>
    )
}