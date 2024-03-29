import {initBoard, initCards} from "./Utils.js";

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
            console.log(action.payload);
            return {
                ...state,
                id: action.payload.playerId,
                color: action.payload.playerColor,
                otherPlayers: action.payload.alreadyConnected,
                roomConfig: action.payload.roomConfig
            };
        case 'set_player_turn':
            return {
                ...state,
                isMyTurn: !state.isMyTurn,
                isFirst: action.payload.isFirst ?? state.isFirst
            };
        case 'has_won':
            alert('You won!');
            return {
                ...state,
                gameIsOn: false,
            };
        case 'has_lost':
            alert(`You Lost :/ ... ${action.payload} won!`);
            return {
                ...state,
                gameIsOn: false,
            };
        case 'other_user_connected':
            // eslint-disable-next-line no-case-declarations
            const otherPlayersCopy = state.otherPlayers.slice();
            otherPlayersCopy.push(action.payload);
            return {
                ...state,
                otherPlayers: otherPlayersCopy
            };
        case 'play_again':
            return {
                ...state,
                gameIsOn: true,
            };
        case 'reset_game_values':
            // eslint-disable-next-line no-case-declarations
            let initialCards = initCards(6, 3);
            // eslint-disable-next-line no-case-declarations
            let firstCard = initialCards[initialCards.length - 1];
            initialCards.splice(-1);

            // eslint-disable-next-line no-case-declarations
            let newBoard = initBoard(6, state.color);
            return {
                ...state,
                card: firstCard,
                board: newBoard,
                gameIsOn: true,
                remainingCards: initialCards
            };
        case 'create_or_join_room':
            console.log(action.payload)
            return {
                ...state,
                roomConfig: action.payload
            };
        case 'waiting_for_player_to_play':
            return  {
                ...state,
                currentPlayerPlaying: action.payload
            };
        default:
            throw Error('Unknown action.');
    }
}