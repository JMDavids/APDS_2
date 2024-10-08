import {PaymentContext} from '../context/paymentContext'
import { useContext } from 'react'

export const usePaymentContext = () => {
    const context = useContext(PaymentContext);

    if (!context) {
        throw Error('usePaymentContext must be used within a PaymentContextProvider');
    }

    return context;
};

