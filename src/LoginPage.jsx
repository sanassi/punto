import './LoginPage.css';
import {useState} from "react";
export default function LoginPage({ setLogged, setLogin }) {
    const [tempLogin, updateTempLogin] = useState('');
    return (
        <div className='login-page'>
            <label>
                Enter a login
            </label>
            <input type={"text"}
                   title="Enter a login"
                   onChange={e => updateTempLogin(e.target.value)} />
            <button onClick={() => {
                setLogged(true);
                setLogin(tempLogin);
            }}>
                Go!
            </button>
        </div>
    );
}