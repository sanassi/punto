import {useRef} from "react";
import './Board.css';
import Tile from "./Tile.jsx";
import {useContainerDimensions} from "./UseContainerDimensions.jsx";
import {socket} from "../socket.js";


export default function Board({state, dispatch}) {
    let boardRef = useRef(null);
    const boardDimensions = useContainerDimensions(boardRef);

    const onClick = (event) => {
        if (boardRef === null)
            return;

        if (!state.isMyTurn)
            return;

        let boardRect = boardRef.current.getBoundingClientRect();
        let clickedTilePos = { x: event.clientX - boardRect.x, y: event.clientY - boardRect.y };

        clickedTilePos.x = Math.floor(clickedTilePos.x / (boardDimensions.height / state.dimension));
        clickedTilePos.y = Math.floor(clickedTilePos.y / (boardDimensions.height / state.dimension));

        // TODO: check if the card can be placed here (ie. if there is a card around x,y)
        /*
        Also: check if the player still has cards that can be placed
        if not: emit a skipped turn message to the server
         */

        function thereIsACardIsNear(x, y) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (x + i < 0 || x + i >= state.dimension || y + j < 0 || y + j >= state.dimension)
                        continue;

                    let tile = state.board[(x + i) * state.dimension + (y + j)];
                    if (tile.visible)
                        return true;
                }
            }

            return false;
        }

        let tile = state.board[clickedTilePos.y * state.dimension + clickedTilePos.x];
        const canPlaceACard = state.isFirst || (tile.card < state.card && thereIsACardIsNear(clickedTilePos.y, clickedTilePos.x));
        if (canPlaceACard) {
            dispatch({ type: 'place_card', payload: {
                    posX: clickedTilePos.y, posY: clickedTilePos.x
                }});

            socket.emit('played_turn', {
                x: clickedTilePos.y,
                y: clickedTilePos.x,
                color: state.color,
                card: state.card,
                playerId: state.id,
                login: state.login,
                room: state.roomConfig.room
            });

            dispatch({type: 'select_new_card'});

            dispatch({
                type: 'set_player_turn',
                payload: { isFirst: false }
            });
        }
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