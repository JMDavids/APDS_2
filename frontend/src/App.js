import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Navbar from './components/navbar';
import Registration from './components/RegisterForm'; 
import Payment from './components/payment';            

import EmployeeLoginPage from './pages/employee';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />  {/* Navbar will remain visible across all routes */}
        <div className='pages'>
          <Routes>
          

            {/* Route to login page */}
            <Route path='/' element={<Login />} />

            {/* Route to registration page */}
            <Route path='/register' element={<Registration />} />

            {/* Route to payment page */}
            <Route path='/payment' element={<Payment />} />

            <Route path="/employee" element={<EmployeeLoginPage/>} /> {/* Define employee login route */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
