import Dice from "./Dice.jsx";
import './RandomDice.css';

export default function RandomDice({ face, color }) {
    return (
        <div className="random-dice">
            <Dice face={face}
                  color={color}
                  visible={true}
            />
        </div>
    )
}