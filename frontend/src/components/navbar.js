import { Link } from "react-router-dom";
import {useLogout} from '../hooks/useLogout';
import { useAuthenticationContext } from "../hooks/useAuthenticationContext";

const Navbar = () => {
    const {logout} = useLogout()
    const{user} = useAuthenticationContext()
    const handleClick = () => {
        logout()
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
                                <button onClick={handleClick}>Logout</button>
                            </div> 
                        )}                       
                        {!user &&(
                            <Link to='/login'>
                                <h3>Login</h3>
                            </Link>
                        )}                          
                    </nav>
            </div>
        </header>
    )
}

export default Navbar