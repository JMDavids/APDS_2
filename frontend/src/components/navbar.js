import { Link } from "react-router-dom";
import { useLogout } from '../hooks/useLogout';
import { useAuthenticationContext } from "../hooks/useAuthenticationContext";

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthenticationContext();

    const handleClick = () => {
        logout();
    }

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>International Payment System</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.email}</span> {/* Display user email when logged in */}
                            <button onClick={handleClick}>Logout</button>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <Link to='/login'>
                                <h3>Login</h3>
                            </Link>
                            <Link to='/register'>
                                <h3>Register</h3>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
