import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Navbar from './components/navbar';
import Registration from './components/RegisterForm';  // Assuming your registration form is here
import Payment from './components/payment';            // Assuming your payment form is here

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />  {/* Navbar will remain visible across all routes */}
        <div className='pages'>
          <Routes>
            {/* Route to home page */}
            <Route path='/' element={<Home />} />

            {/* Route to login page */}
            <Route path='/login' element={<Login />} />

            {/* Route to registration page */}
            <Route path='/register' element={<Registration />} />

            {/* Route to payment page */}
            <Route path='/payment' element={<Payment />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
