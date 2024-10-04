import { useState } from 'react';
import { usePaymentContext } from '../hooks/usepaymentContext';

const Payment = () => {
  const { dispatch } = usePaymentContext();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [provider, setProvider] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing on submit

    const payment = { amount, currency, provider, accountInfo, swiftCode };

    // Get the JWT token from localStorage
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    if (!token) {
      setError('User is not authenticated');
      return;
    }

    const response = await fetch('http://localhost:5000/api/payments', {
      method: 'POST',
      body: JSON.stringify(payment), // Converting payment object to JSON
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Attach the JWT token
      },
    });

    const json = await response.json();

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
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add new Payment</h3>

      <label>Payment Amount:</label>
      <input
        type="number"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        required
      />

      <label>Currency Type:</label>
      <input
        type="text"
        onChange={(e) => setCurrency(e.target.value)}
        value={currency}
        required
      />

      <label>Payment Provider:</label>
      <input
        type="text"
        onChange={(e) => setProvider(e.target.value)}
        value={provider}
        required
      />

      <label>Account Info:</label>
      <input
        type="text"
        onChange={(e) => setAccountInfo(e.target.value)}
        value={accountInfo}
        required
      />

      <label>Swift Code:</label>
      <input
        type="text"
        onChange={(e) => setSwiftCode(e.target.value)}
        value={swiftCode}
        required
      />

      <button type="submit">Add Payment</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Payment;
