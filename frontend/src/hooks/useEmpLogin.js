import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EmployeeLoginPage = () => {
  const [empID, setEmpID] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [employee, setEmployee] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!empID || !password) {
      setErrorMessage('Please fill in both fields')
      return
    }

    try {
      const response = await fetch(
        'https://localhost:5000/api/employee/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empID, password }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        setErrorMessage(data.message || 'Login failed')
        return
      }

      const data = await response.json()
      setEmployee(data.employee)
      setIsAuthenticated(true)
      setErrorMessage('')
      navigate('/payment')
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('An error occurred during login')
    }
  }

  return (
    <div>
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee ID"
          value={empID}
          onChange={(e) => setEmpID(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}

export default EmployeeLoginPage
