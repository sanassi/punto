import './LoginPage.css';
import {useState} from "react";
import { socket } from '../socket.js';

export default function LoginPage({ state, dispatch, setLogged, setLogin }) {
    const [tempLogin, updateTempLogin] = useState('');
    const [tempRoom, setTempRoom] = useState('dummy-room');
    const [numberOfPlayers, setNumberOfPlayers] = useState(2);

    const [joinRoom, setJoinRoom] = useState(false);
    const [createRoom, setCreateRoom] = useState(false);

    const joinRoomComponent = (
        <div className='join-room'>
            <label>Join a room</label>
            <input type={"text"}
                   onChange={e => setTempRoom(e.target.value)}/>
        </div>
    );

    /**
     * The server should emit a message with the generated room id
     * @type {JSX.Element}
     */
    const createRoomComponent = (
        <div className='create-room'>
            <label>Create a room</label>
            <input type={"number"}
                   min={2} max={4}
                   placeholder='# of Players'
                   onChange={e => setNumberOfPlayers(e.target.value)}/>
        </div>
    );

    const roomSelector = (
        <div className='room-selector'>
            <div>
                <button onClick={() => setJoinRoom(true)}>Join a room</button>
            </div>
            <div className='vertical-divider'>Or</div>
            <div>
                <button onClick={() => {
                    setCreateRoom(true);
                }}>
                    Create a room
                </button>
            </div>
        </div>
    )

    return (
        <div className='login-page'>
            {joinRoom ? joinRoomComponent : (createRoom ? createRoomComponent : roomSelector)}
            <div className='login-enter'>
                <label>Enter a login</label>
                <input type={"text"}
                       title="Enter a login"
                       onChange={e => updateTempLogin(e.target.value)} />
                <button className='go-button' onClick={() => {
                    const inputIsValid = tempLogin !== null &&
                        tempLogin !== '' && tempRoom !== null && tempRoom !== '';
                    if (inputIsValid) {
                        setLogin(tempLogin);
                        dispatch({
                            type: 'create_or_join_room',
                            payload: {
                                type: createRoom ? 'create_room' : 'join_room',
                                room: createRoom ? '' : tempRoom,
                                numberOfPlayers: numberOfPlayers
                            }
                        });

                        socket.connect();
                    }
                }}>
                    Go!
                </button>

            </div>
        </div>
    );
}