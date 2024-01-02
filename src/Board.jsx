import {useRef, useState} from "react";
import './Board.css';
import Tile from "./Tile.jsx";
import {useContainerDimensions} from "./UseContainerDimensions.jsx";
import {getRandomIntInclusive} from "./Utils.js";

function initBoard(dimension) {
    let arr = Array.from({length: dimension * dimension});
    return arr.map((t, index) => {
        return {
            x: Math.floor(index / dimension),
            y: Math.floor(index % dimension),
            visible: false,
            playerColor: '#073b7e'
        };
    });
}

export default function Board() {
    let boardRef = useRef(null);
    const dimension = 6;
    const [board, setBoard] = useState(initBoard(dimension));

    const boardDimensions = useContainerDimensions(boardRef);

    const onClick = (event) => {
        if (boardRef === null)
            return;

        let boardRect = boardRef.current.getBoundingClientRect();
        let clickedTilePos = { x: event.clientX - boardRect.x, y: event.clientY - boardRect.y };

        clickedTilePos.x = Math.floor(clickedTilePos.x / (boardDimensions.height / dimension));
        clickedTilePos.y = Math.floor(clickedTilePos.y / (boardDimensions.height / dimension));

        setBoard(board.map(
            (t) => {
                if (t.x === clickedTilePos.y && t.y === clickedTilePos.x) {
                    t.visible = true;
                    return t;
                }
                else
                    return t;
            }
        ))
    }

    const tiles = board.map((t, index) => {
        return (
            <Tile
                key={`tile-${index}`}
                index={index}
                visible={t.visible}
                face={getRandomIntInclusive(1, 6)}
                color={t.playerColor}
            />
        );
    });

    return <div ref={boardRef}
                onClick={onClick}
                className='board'>
        {tiles}
    </div>
}