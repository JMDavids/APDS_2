import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Navbar from './components/navbar';
import Registration from './components/RegisterForm'; 
import Payment from './components/payment';
import EmployeeDashboard from './components/EmployeeDashboard';
import EmployeeLoginPage from './pages/employee';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            {/* Route to login page */}
            <Route path='/' element={<Login />} />

            {/* Route to registration page */}
            <Route path='/register' element={<Registration />} />

            {/* Route to payment page */}
            <Route path='/payment' element={<Payment />} />

            {/* Define employee login route */}
            <Route path="/employee" element={<EmployeeLoginPage />} />

            {/* Route to Employee Dashboard */}
            <Route path="/dashboard" element={<EmployeeDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
