import { createContext, useReducer } from "react";

export const PaymentContext = createContext();

export const paymentReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PAYMENT':
            return {
                payment: action.payload
            };
        case 'CREATE_PAYMENT':
            return {
                payment: [action.payload, ...(state.payment || [])]
            };
        case 'DELETE_PAYMENT':
            return {
                payment: state.payment.filter(payment => payment.id !== action.payload.id)
            };
        default:
            return state;
    }
}

export const PaymentContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(paymentReducer, {
        payment: []
    });

    return (
        <PaymentContext.Provider value={{ ...state, dispatch }}>
            {children}
        </PaymentContext.Provider>
    );
}
