import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, CircularProgress } from '@mui/material';

const EmployeeLoginPage = () => {
    const [empID, setEmpID] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('https://localhost:5000/api/employee/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empID, password }),
            });
            const data = await response.json();

            if (response.ok) {
                setEmployee(data.employee);
                setIsAuthenticated(true);
                setErrorMessage('');
                navigate('/dashboard');
            } else {
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return (
            <div>
                <p>Welcome, {employee?.empID}</p>
            </div>
        );
    }

    return (
        <Container component="main" maxWidth="xs" style={{ paddingTop: '100px' }}>
            <Typography variant="h2" align="center">Login</Typography>
            <form onSubmit={handleSubmit}>  {/* Use handleSubmit here */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Employee ID"
                    type="text"
                    onChange={(e) => setEmpID(e.target.value)}
                    value={empID} 
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
                {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
            </form>
        </Container>
    );
};

export default EmployeeLoginPage;
