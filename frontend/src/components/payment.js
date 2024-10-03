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

    const response = await fetch('http://localhost:5000/api/payments', {
      method: 'POST',
      body: JSON.stringify(payment), // Converting our payment to JSON
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
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
      />

      <label>Currency Type:</label>
      <input
        type="text"
        onChange={(e) => setCurrency(e.target.value)}
        value={currency}
      />

      <label>Payment Provider:</label>
      <input
        type="text"
        onChange={(e) => setProvider(e.target.value)}
        value={provider}
      />

      <label>Account Info:</label>
      <input
        type="text"
        onChange={(e) => setAccountInfo(e.target.value)}
        value={accountInfo}
      />

      <label>Swift Code:</label>
      <input
        type="text"
        onChange={(e) => setSwiftCode(e.target.value)}
        value={swiftCode}
      />

      <button type="submit">Add Payment</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Payment;
