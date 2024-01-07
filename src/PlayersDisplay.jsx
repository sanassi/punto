import './PlayersDisplay.css';

export default function PlayersDisplay({ state }) {
    return (
        <div className='players-display'>
            <label className='room-label'>{state.roomConfig.room}</label>
            <label>Connected:</label>
            <ul>
                {
                    state.otherPlayers.map(p => {
                        return (
                           <li key={`li-${p}`}
                                   className={state.currentPlayerPlaying === p ? 'current-playing' : ''}>
                           {p}
                        </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}