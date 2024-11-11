import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const EmployeeLoginPage = () => {
    const [empID, setEmpID] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [employee, setEmployee] = useState(null);

    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                setErrorMessage(''); // Clear error if successful
                // Redirect to the dashboard (or another page) after successful login
                navigate('/dashboard');  // Redirect to your desired page
            } else {
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred during login');
        }
    };

    if (isAuthenticated) {
        return (
            <div>
                <p>Welcome, {employee?.empID}</p>
                {/* Optionally, show a message or loader while redirecting */}
            </div>
        );
    }

    return (
        <div>
            <h2>Employee Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Employee ID"
                    value={empID}
                    onChange={(e) => setEmpID(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default EmployeeLoginPage;
