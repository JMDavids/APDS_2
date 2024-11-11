import React, { useState } from 'react';
import { Button, TextField, Typography, Container, CircularProgress } from '@mui/material';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const { login, isLoading, error } = useLogin();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(email, password, accountNumber);
        if (success) {
            navigate('/payment');
        }
    };

    return (
        <Container component="main" maxWidth="xs" style={{ paddingTop: '100px' }}>
            <Typography variant="h2" align="center">Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Account Number"
                    type="text"
                    onChange={(e) => setAccountNumber(e.target.value)}
                    value={accountNumber}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    style={{ position: 'relative' }}
                >
                    {isLoading && <CircularProgress size={24} style={{ position: 'absolute' }} />}
                    Login
                </Button>
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </form>
        </Container>
    );
}

export default Login;
