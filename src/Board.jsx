import {useRef} from "react";
import './Board.css';
import Tile from "./Tile.jsx";
import {useContainerDimensions} from "./UseContainerDimensions.jsx";
import {socket} from "../socket.js";


export default function Board({state, dispatch}) {
    let boardRef = useRef(null);
    const dimension = 6;

    const boardDimensions = useContainerDimensions(boardRef);

    const onClick = (event) => {
        if (boardRef === null)
            return;

        if (!state.isMyTurn)
            return;

        let boardRect = boardRef.current.getBoundingClientRect();
        let clickedTilePos = { x: event.clientX - boardRect.x, y: event.clientY - boardRect.y };

        clickedTilePos.x = Math.floor(clickedTilePos.x / (boardDimensions.height / dimension));
        clickedTilePos.y = Math.floor(clickedTilePos.y / (boardDimensions.height / dimension));

        // TODO: check if the card can be placed here (ie. if there is a card around x,y)
        dispatch({ type: 'place_card', payload: {
            posX: clickedTilePos.y, posY: clickedTilePos.x
        }});

        socket.emit('played_turn', {
                x: clickedTilePos.y,
                y: clickedTilePos.x,
                color: state.color,
                card: state.card,
                playerId: state.id,
                login: state.login
        });

        dispatch({type: 'select_new_card'});

        dispatch({
            type: 'set_player_turn'
        });
    }

    const tiles = state.board.map((t, index) => {
        return (
            <Tile
                key={`tile-${index}`}
                index={index}
                visible={t.visible}
                face={t.card}
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