import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const { login, isLoading, error } = useLogin();
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent page refresh on submit
        const success = await login(email, password, accountNumber);

        // Redirect to home page if login is successful
        if (success) {
            navigate('/payment');
        }
    };

    return (
        <div>
            <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Login</h1>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
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
                        Account Number:
                        <input
                            type="text"
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
