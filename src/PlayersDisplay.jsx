import './PlayersDisplay.css';

export default function PlayersDisplay({ state }) {
    return (
        <div className='players-display'>
            <label className='room-label'>Room #{state.roomConfig.room}</label>
            <div className='other-players'>
                {
                    state.otherPlayers.map(p => {
                        return (
                           <label key={`li-${p}`}
                                   className={` other-players-label ${state.currentPlayerPlaying === p ? 'current-playing' : ''}`}>
                           {p}
                        </label>
                        )
                    })
                }
            </div>
        </div>
    );
}