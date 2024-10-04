import { useState } from 'react';

export const usePayment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitPayment = async (paymentData) => {
        // Get the JWT token from localStorage
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        if (!token) {
            setError('User is not authenticated');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://localhost:5000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Attach the JWT token
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setIsLoading(false);
            return data; // Return payment data if successful
        } catch (err) {
            setIsLoading(false);
            setError(err.message);
        }
    };

    return { submitPayment, isLoading, error };
};
