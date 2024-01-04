import {socket} from "../socket.js";

export default function PlayAgainButton({ state, dispatch }) {
    const onClick = () => {
        dispatch({ type: 'play_again' });
        console.log(state.gameIsOn);
        socket.emit('prepare_for_new_game');
    }
    return (
        <div className='play-again-button' hidden={state.gameIsOn}>
            <button onClick={onClick}>Play Again</button>
        </div>
    )
}