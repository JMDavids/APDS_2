import { createContext, useReducer } from "react";

export const AuthenticationContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state, // Spread the existing state
                employee: action.payload
            };
        case 'LOGOUT':
            return {
                ...state, // Keep other properties in state if necessary
                employee: null
            };
        default:
            return state;
    }
}

// The initial state should contain an 'employee' property, not 'user'
export const EMPContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { employee: null }); // Set initial state to have 'employee'

    console.log("AuthContext state: ", state);

    return (
        <AuthenticationContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthenticationContext.Provider>
    );
}
