import {useState} from "react";
import './Board.css';
import Tile from "./Tile.jsx";
export default function Board() {
    const dimension = 6;
    const [board, setBoard] = useState(Array.from({length: dimension * dimension}));

    const tiles = board.map((t, index) => {
        return (<Tile face={index % 6 + 1}/>);
    });

    return <div className='board'>
        {tiles}
    </div>
}