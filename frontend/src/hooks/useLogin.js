import { useState } from 'react';
import { useAuthenticationContext } from './useAuthenticationContext';
export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthenticationContext();

    const login = async (email, password, accountNumber) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, accountNumber }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                setIsLoading(false);
                return false;
            } else {
                // Store JWT token in localStorage
                localStorage.setItem('user', JSON.stringify(data));

                // Update authentication context
                dispatch({ type: 'LOGIN', payload: data });

                setIsLoading(false);
                return true;
            }
        } catch (err) {
            setError('Failed to login');
            setIsLoading(false);
            return false;
        }
    };

    return { login, isLoading, error };
};
