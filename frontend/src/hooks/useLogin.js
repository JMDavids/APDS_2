import { useState } from 'react';
import { useAuthenticationContext } from './useAuthenticationContext'; // Assuming you have this context for managing user state


export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthenticationContext(); // To update user state in the context

    const login = async (email, password, accountNumber) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, accountNumber }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                setIsLoading(false);
            } else {
                // Store JWT token in localStorage
                localStorage.setItem('user', JSON.stringify(data));

                // Update authentication context
                dispatch({ type: 'LOGIN', payload: data });

                setIsLoading(false);
            }
        } catch (err) {
            setError('Failed to login');
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
