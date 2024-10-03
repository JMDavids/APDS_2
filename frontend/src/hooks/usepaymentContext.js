import {PaymentContext} from '../context/paymentContext'
import { useContext } from 'react'

export const usePaymentContext = () => {
    const context = useContext(PaymentContext);

    if (!context) {
        throw Error('usePaymentContext must be used within a PaymentContextProvider');
    }

    return context;
};

//EVERY TIME WE WANT TO USE ANY BOOK DATA, WE CAN JUST INVOKE THIS HOOK
//IT WILL UPDATE OUR GLOBAL CONTEXT, INSTEAD OF A LOCAL STATE