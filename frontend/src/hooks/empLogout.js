import { useAuthenticationContext } from "./EMPContextProvider";

export const useLogout = () => {
    const { dispatch } = useAuthenticationContext();

    const logout = () => {
        localStorage.removeItem('employee');
        dispatch({ type: "LOGOUT" });
    };

    return { logout };
};
