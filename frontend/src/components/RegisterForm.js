import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    idNumber: '',
    accountNumber: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state

    try {
      const response = await axios.post('https://localhost:5000/api/users/signup', formData);

      // If successful, redirect to home page
      setSuccess('User registered successfully!');
      setError(null);
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Something went wrong');
      setSuccess(null);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" align="center">Register</Typography>
      
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="ID Number"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
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
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Registration;
