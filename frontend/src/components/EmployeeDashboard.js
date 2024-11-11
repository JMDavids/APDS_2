import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';

const EmployeeDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('employeeToken');
        const response = await fetch('https://localhost:5000/api/employee/payments', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to fetch payments');
          return;
        }

        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setErrorMessage('An error occurred while fetching payments');
      }
    };

    fetchPayments();
  }, []);

  const verifyPayment = async (paymentId) => {
    try {
      const token = localStorage.getItem('employeeToken');
      const response = await fetch(`https://localhost:5000/api/employee/verify-payment/${paymentId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to verify payment');
        return;
      }

      const data = await response.json();

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId ? { ...payment, verified: true } : payment
        )
      );

      setSuccessMessage('Payment verified successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('An error occurred while verifying the payment');
    }
  };

  const viewUser = async (accountNumber) => {
    setUserDetails(null);
    setUserError('');

    try {
      const token = localStorage.getItem('employeeToken');

      const response = await fetch(`https://localhost:5000/api/employee/user/${accountNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUserError(errorData.error || 'Failed to fetch user details');
        return;
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserError('An error occurred while fetching user details');
    }
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Employee Dashboard - All Payments
      </Typography>

      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
        >
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {errorMessage && (
        <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage('')}>
          <Alert severity="error" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}

      {payments.length === 0 ? (
        <Typography align="center" color="textSecondary">
          No payments found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {payments.map((payment) => (
            <Grid item xs={12} sm={6} md={4} key={payment._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Details
                  </Typography>
                  <Typography variant="body2">Amount: {payment.amount}</Typography>
                  <Typography variant="body2">Currency: {payment.currency}</Typography>
                  <Typography variant="body2">Provider: {payment.provider}</Typography>
                  <Typography variant="body2">SWIFT Code: {payment.swiftCode}</Typography>
                  <Typography variant="body2">
                    Verified: {payment.verified ? 'Yes' : 'No'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => viewUser(payment.accountInfo)}
                  >
                    View Payee
                  </Button>
                  {!payment.verified && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => verifyPayment(payment._id)}
                    >
                      Verify Payment
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {userError && (
        <Snackbar open={!!userError} autoHideDuration={3000} onClose={() => setUserError('')}>
          <Alert severity="error" onClose={() => setUserError('')}>
            {userError}
          </Alert>
        </Snackbar>
      )}

      {userDetails && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Payee Details
          </Typography>
          <Typography variant="body1">Full Name: {userDetails.fullName}</Typography>
          <Typography variant="body1">Email: {userDetails.email}</Typography>
          <Typography variant="body1">Account Number: {userDetails.accountNumber}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default EmployeeDashboard;
