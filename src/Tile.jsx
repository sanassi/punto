import './Tile.css';
import Dice from "./Dice.jsx";
export default function Tile({ face }) {
    return (
        <div className='tile'>
            <Dice face={face} />
        </div>
    )
}