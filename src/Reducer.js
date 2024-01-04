export function reducer(state, action) {
    switch (action.type) {
        case 'select_new_card':
            if (state.remainingCards.length === 0)
                return {
                    ...state
                };

            // eslint-disable-next-line no-case-declarations
            let newCards = state.remainingCards.slice();
            newCards.splice(-1);

            return {
                ...state,
                remainingCards: newCards,
                card: newCards[newCards.length - 1]
            };
        case 'place_card':
            return {
                ...state,
                board: state.board.map(
                    (t) => {
                        if (t.x === action.payload.posX && t.y === action.payload.posY) {
                            if (!t.visible || t.card < state.card) {
                                t.card = state.card;
                                t.playerColor = state.color;
                                t.visible = true;
                            }
                            return t;
                        }
                        else
                            return t;
                    }
                )
            };
        case 'other_played_card':
            console.log('Payload');
            console.log(action.payload);
            console.log(`[${action.payload.playerId}] ${action.payload.login} played`);
            return {
                ...state,
                board: state.board.map(
                    (t) => {
                        if (t.x === action.payload.x && t.y === action.payload.y) {
                            t.playerColor = action.payload.color;
                            t.card = action.payload.card;
                            t.visible = true;
                        }
                        return t;
                    }
                )
            };
        case 'assign_credentials':
            return {
                ...state,
                id: action.payload.playerId,
                color: action.payload.playerColor
            };
        case 'set_player_turn':
            return {
                ...state,
                isMyTurn: !state.isMyTurn
            };
        case 'has_won':
            alert('You won!');
            return {
                ...state
            };
        case 'has_lost':
            alert(`You Lost :/ ... ${action.payload} won!`);
            return {
                ...state
            };
        default:
            throw Error('Unknown action.');
    }
}