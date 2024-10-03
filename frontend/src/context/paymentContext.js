import { createContext, useReducer } from "react";

export const PaymentContext = createContext();

export const paymentReducer = (state, action) => {
    switch (action.type) {
        // setting payments
        case 'SET_PAYMENT':
            return {
                // Replace state with the new payment data from the payload
                payment: action.payload
            };
        // creating a payment
        case 'CREATE_PAYMENT':
            return {
                // Spread previous payments and add the new one
                payment: [action.payload, ...(state.payment || [])]
            };
        // deleting a payment
        case 'DELETE_PAYMENT':
            return {
                payment: state.payment.filter(payment => payment.id !== action.payload.id)
            };
        default:
            return state;
    }
}

export const PaymentContextProvider = ({ children }) => {
    // reducer takes in the current state and the dispatch function
    const [state, dispatch] = useReducer(paymentReducer, {
        payment: []  // Initialize with an empty array
    });

    return (
        <PaymentContext.Provider value={{ ...state, dispatch }}>
            {children}
        </PaymentContext.Provider>
    );
}
