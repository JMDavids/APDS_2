import React, { useState } from 'react';
import { usePaymentContext } from '../hooks/usepaymentContext';
import { TextField, Button, Typography, Container, CircularProgress, Snackbar } from '@mui/material';

const Payment = () => {
  const { dispatch } = usePaymentContext();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [provider, setProvider] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payment = { amount, currency, provider, accountInfo, swiftCode };

    // Get the JWT token from localStorage
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    if (!token) {
      setError('User is not authenticated');
      setIsLoading(false);
      return;
    }

    const response = await fetch('https://localhost:5000/api/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const json = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      // Clear form fields after successful submission
      setAmount('');
      setCurrency('');
      setProvider('');
      setAccountInfo('');
      setSwiftCode('');
      setError(null);
      console.log('New payment added', json);
      dispatch({ type: 'CREATE_PAYMENT', payload: json });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" align="center">Add New Payment</Typography>
      <form className="create" onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Payment Amount"
          type="number"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Currency Type"
          onChange={(e) => setCurrency(e.target.value)}
          value={currency}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Payment Provider"
          onChange={(e) => setProvider(e.target.value)}
          value={provider}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Account Info"
          onChange={(e) => setAccountInfo(e.target.value)}
          value={accountInfo}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Swift Code"
          onChange={(e) => setSwiftCode(e.target.value)}
          value={swiftCode}
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
          Add Payment
        </Button>
      </form>
      {error && <Snackbar open={Boolean(error)} message={error} onClose={() => setError(null)} autoHideDuration={6000} />}
    </Container>
  );
};

export default Payment;
