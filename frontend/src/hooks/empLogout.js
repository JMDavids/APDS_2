import { useAuthenticationContext } from "./EMPContextProvider"; // Correct path to your context hook

export const useLogout = () => {
    const { dispatch } = useAuthenticationContext(); // Use the hook to get the context

    const logout = () => {
        localStorage.removeItem('employee'); // Remove employee data from localStorage
        dispatch({ type: "LOGOUT" }); // Dispatch the "LOGOUT" action
    };

    return { logout }; // Return the logout function
};
