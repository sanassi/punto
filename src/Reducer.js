
export function reducer(state, action) {
    switch (action.type) {
        case 'select_new_card':
            return {
                ...state,
                card: action.payload.cardValue
            };
        case 'place_card':
            return {
                ...state,
                board: state.board.map(
                    (t) => {
                        if (t.x === action.payload.posX && t.y === action.payload.posY) {
                            if (!t.visible || t.card < state.card) {
                                t.card = state.card;
                                t.visible = true;
                            }
                            return t;
                        }
                        else
                            return t;
                    }
                )
            }
        default:
            throw Error('Unknown action.');
    }
}