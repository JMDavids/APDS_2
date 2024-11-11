import React, { useEffect, useState } from 'react';

const EmployeeDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
      const response = await fetch(`http://localhost:5000/api/employee/verify-payment/${paymentId}`, {
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

      alert('Payment verified successfully');
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('An error occurred while verifying the payment');
    }
  };

  if (errorMessage) {
    return <p style={{ color: 'red' }}>{errorMessage}</p>;
  }

  return (
    <div>
      <h2>All Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        payments.map((payment) => (
          <div key={payment._id}>
            <p>Amount: {payment.amount}</p>
            <p>Currency: {payment.currency}</p>
            <p>Provider: {payment.provider}</p>
            <p>SWIFT Code: {payment.swiftCode}</p>
            <p>Verified: {payment.verified ? 'Yes' : 'No'}</p>
            {!payment.verified && (
              <button onClick={() => verifyPayment(payment._id)}>Verify Payment</button>
            )}
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default EmployeeDashboard;
