import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CustomerPayments = () => {
  const { userId } = useParams();
  const [payments, setPayments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('employeeToken');
        const response = await fetch(`http://localhost:5000/api/employee/customers/${userId}/payments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Handle non-200 responses
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
  }, [userId]);

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

      const data = await response.json();

      if (response.ok) {
        // Update the payment's verified status in the state
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment._id === paymentId ? { ...payment, verified: true } : payment
          )
        );
        alert('Payment verified successfully');
      } else {
        alert(data.error || 'Failed to verify payment');
      }
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
      <h2>Payments for Customer</h2>
      {payments.map((payment) => (
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
      ))}
    </div>
  );
};

export default CustomerPayments;
