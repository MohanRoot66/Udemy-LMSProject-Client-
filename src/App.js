import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: localStorage.getItem('isLoggedIn') === localStorage.getItem('isLoggedIn') === true || false,
      
    }
    //  alert('loggedIn ******************** ' + this.state.isLoggedIn)
    // alert('localStorage.getItem'+localStorage.getItem('isLoggedIn'))
    // alert('in constructor ...... ' + localStorage.getItem('isLoggedIn') + this.state.isLoggedIn)
  }

  setIsLoggedIn = (value) => {
    this.setState({ isLoggedIn: value })
    // alert("loggedIn ================== "+this.state.isLoggedIn)
    localStorage.setItem('isLoggedIn', value)
  }
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route
              path="/"
              element={
                <Login isLoggedIn={this.state.isLoggedIn} setIsLoggedIn={this.setIsLoggedIn} />
              }
            />
            <Route
              path="*"
              element={this.state.isLoggedIn ? <DefaultLayout /> : <Navigate to="/" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* <Route exact path="/" name="Login Page" element={<Login />} /> */}
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}
            {/* <Redirect to="/login" /> */}
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
