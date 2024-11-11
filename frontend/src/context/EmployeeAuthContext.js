import { createContext, useReducer } from "react";

export const AuthenticationContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                employee: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                employee: null
            };
        default:
            return state;
    }
}

export const EMPContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { employee: null });

    console.log("AuthContext state: ", state);

    return (
        <AuthenticationContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthenticationContext.Provider>
    );
}
