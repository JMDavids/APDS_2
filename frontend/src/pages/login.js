import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, isLoading, error} = useLogin()
    const [accountNumber,setAccountNumber] = useState('');

    const handleLogin = async(e) => {
       e.preventDefault() //do not refresh on submit
       await login(email, password)
    };

    return (
        <div>
            <h1 style={{display: "flex", justifyContent: "center", alignItems: "center"}}>Login</h1>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "50vh"}}>
            <form>
                <label>
                    Email:
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </label>
                <br />
                <label>
                    accountNumber:
                    <input
                        type="account number"
                        onChange={(e) => setAccountNumber(e.target.value)}
                        value={accountNumber}
                    />
                </label>
                <br />
                <button type="button" onClick={handleLogin} disabled={isLoading}>
                    Login
                </button>
                {error && <div className='error'>{error}</div>}
            </form>
            </div>
        </div>
    );
}

export default Login;