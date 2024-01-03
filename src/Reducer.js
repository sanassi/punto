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
        case 'assign_color':
            return {
                ...state,
                color: action.payload
            };
        case 'set_player_turn':
            return {
                ...state,
                isMyTurn: !state.isMyTurn
            };
        default:
            throw Error('Unknown action.');
    }
}