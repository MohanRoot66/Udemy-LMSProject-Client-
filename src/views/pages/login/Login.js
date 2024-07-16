import React from 'react'
import { Link, Navigate, Router } from 'react-router-dom'
import { Outlet, useNavigate } from 'react-router-dom'
import Dashboard from 'src/views/dashboard/Dashboard'
import pic2 from './dashboard.png'
import { useState, useEffect } from 'react'
import './loginStyles.css'
import pic from './login image-modified.png'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilInfo, cilLockUnlocked, cilText, cilUser } from '@coreui/icons'

const Login = ({ isLoggedIn, setIsLoggedIn }) => {
  const [clientId, setEmail] = useState('')
  const [clientSecret, setPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')
  const [path, setPath] = useState('')
  const [data, setData] = useState([])
  const [invalid,setInvalid]=useState(false)
  const navigate = useNavigate()
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // alert('in login .................. ' + isLoggedIn)
    const user = { clientId, clientSecret }
    try {
      fetch('http://localhost:5002/login', {
        method: 'POST', // Use uppercase 'POST'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      setIsLoggedIn(false)
      localStorage.setItem('client', JSON.stringify(user))
      // alert('localStorage === ' + localStorage.getItem('client'))
    } catch (error) {
      // Handle network or other errors
      setIsLoggedIn(false)
      alert(error)
      setLoginMessage('An error occurred while processing your request.')
    }
  }, [])

  const handleSubmit = async (e) => {
    console.log('submitted................')
    e.preventDefault()
    const user = { clientId, clientSecret }
    console.log('in the method')
    if (clientId != null && clientSecret != null) {
      try {
        const response = await fetch('http://localhost:5002/login', {
          method: 'POST', // Use uppercase 'POST'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })

        if (response.status === 200) {
          const data = await response.json()

          setLoginMessage(data.detail)
          let msg = data.detail
          console.log('loginMsg : ' + loginMessage)
          if (data.detail == 'SuccessFully Logged In') {
            setIsLoggedIn(true)
            setInvalid(false)
            localStorage.setItem('client', JSON.stringify(user))
            // alert(
            //   'local storage == ' +
            //     JSON.stringify(user) +
            //     '  ######  ' +
            //     localStorage.getItem('client'),
            // )

            // <Link to='/dashboard'>Go to Dashboard</Link>
            // console.log('iffffffffffffffffffffff')
            // alert('Welcome .............')
            setPath('/dashboard')
            // return <Dashboard />
            navigate('/dashboard') // Redirect to the dashboard route
          } else {
            setInvalid(true)
            // console.log('elseeeeeeeeeeeeeeeeee')
            // alert('Enter valid details')
          }
          console.log(data.detail)
          // alert(data)
        } else {
          // Handle failed login and display the error message
          const data = await response.json() // Assuming the error message is sent as JSON
          setLoginMessage(data.message)
        }
      } catch (error) {
        // Handle network or other errors
        // alert(error)
        setLoginMessage('An error occurred while processing your request.')
      }
    } else {
      console.log('in the else')
    }
  }
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="fullpage">
      <div className="container" style={{ borderRadius: '20px' }}>
        <div className="screen">
          <div className="screen__content">
            <form className="login" onSubmit={handleSubmit}>
              <strong>
                <p style={{ marginBottom: '8vh', fontSize: '30px' }}>LMS</p>
              </strong>
              <p className="text-medium-emphasis">
                <img src={process.env.PUBLIC_URL + pic} alt="User Icon" height="35px" /> Log In to
                your account{' '}
              </p>
              <p style={{ color: invalid ? 'red' : '', fontSize: '15px' }}>
                {invalid ? 'Invalid Credentials' : ''}
              </p>
              <div className="login__field">
                <i className="login__icon fas fa-user"></i>
                <input
                  type="text"
                  className="login__input"
                  placeholder="Client Id "
                  autoComplete="username"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="login__field">
                <i className="login__icon fas fa-lock"></i>
                <input
                  type="password"
                  className="login__input"
                  placeholder="Client Secret"
                  autoComplete="username"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="button login__submit">
                <span className="button__text">Log In Now</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            </form>
          </div>
          <div className="screen__background">
            <span className="screen__background__shape screen__background__shape4"></span>
            <span className="screen__background__shape screen__background__shape3"></span>
            <span className="screen__background__shape screen__background__shape2"></span>
            <span className="screen__background__shape screen__background__shape1"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
