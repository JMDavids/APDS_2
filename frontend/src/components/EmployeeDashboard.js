import React, { useEffect, useState } from 'react';

const EmployeeDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null); // Holds the user details or null
  const [userError, setUserError] = useState(''); // Error message if user not found

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('employeeToken');
        const response = await fetch('https://localhost:5000/api/employee/payments', {
          headers: {
            'Authorization': `Bearer ${token}`,
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to verify payment');
        return;
      }

      const data = await response.json();

      // Update the payment's verified status in the state
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId ? { ...payment, verified: true } : payment
        )
      );

      // Display a success message
      setSuccessMessage('Payment verified successfully');
      // Hide the message after a few seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('An error occurred while verifying the payment');
    }
  };

  if (errorMessage) {
    return <p style={{ color: 'red' }}>{errorMessage}</p>;
  }

  const viewUser = async (accountNumber) => {
    setUserDetails(null); // Reset previous user details
    setUserError(''); // Reset previous error message

    try {
      const token = localStorage.getItem('employeeToken');

      const response = await fetch(`https://localhost:5000/api/employee/user/${accountNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUserError(errorData.error || 'Failed to fetch user details');
        return;
      }

      const data = await response.json();
      setUserDetails(data); // Set the fetched user details
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserError('An error occurred while fetching user details');
    }
  };

  if (errorMessage) {
    return <p style={{ color: 'red' }}>{errorMessage}</p>;
  }


  return (
    <div>
      <h2>All Payments</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        payments.map((payment) => (
          <div key={payment._id}>
            <p>Amount: {payment.amount}</p>
            <p>Currency: {payment.currency}</p>
            <p>Provider: {payment.provider}</p>
            <p>SWIFT Code: {payment.swiftCode}</p>
            <p>Account Info (Payee): {payment.accountInfo}</p>
            <button onClick={() => viewUser(payment.accountInfo)}>View Payee</button>

            {/* Display Payer's Details */}
            <h3>Payer Details</h3>
            <p>Full Name: {payment.userId.fullName}</p>
            <p>Username: {payment.userId.username}</p>
            <p>Account Number: {payment.userId.accountNumber}</p>

            <p>Verified: {payment.verified ? 'Yes' : 'No'}</p>
            {!payment.verified && (
              <button onClick={() => verifyPayment(payment._id)}>Verify Payment</button>
            )}
            <hr />
          </div>
        ))
      )}
      {/* Display Payee Details or Error */}
      {userError && <p style={{ color: 'red' }}>{userError}</p>}
      {userDetails && (
        <div>
          <h3>Payee Details</h3>
          <p>Full Name: {userDetails.fullName}</p>
          <p>Email: {userDetails.email}</p>
          <p>Account Number: {userDetails.accountNumber}</p>
          <p>ID Number: {userDetails.idNumber}</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;