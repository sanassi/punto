import './PlayersDisplay.css';

export default function PlayersDisplay({ state }) {
    return (
        <div className='players-display'>
            <label>Connected:</label>
            <ul>
                {
                    state.otherPlayers.map(p => {
                        return <li key={`li-${p}`}>{p}</li>
                    })
                }
            </ul>
        </div>
    );
}