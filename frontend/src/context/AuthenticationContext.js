import { createContext, useReducer } from "react";

export const AuthenticationContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.payload
            };
        case 'LOGOUT':
            return {
               user: null
            };
        default:
            return state;
    }
}

export const AuthenticationContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {user: []});

    console.log("AuthContext state: ", state)

    return(
        <AuthenticationContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthenticationContext.Provider>
    )
}
