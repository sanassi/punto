import './Tile.css';
import Dice from "./Dice.jsx";
export default function Tile({ face, visible, color }) {
    return (
        <div className='tile'>
            <Dice face={face}
                  visible={visible}
                  color={color}/>
        </div>
    )
}