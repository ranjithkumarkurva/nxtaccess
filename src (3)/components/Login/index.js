import {Component} from 'react'
// import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    showErrorMsg: false,
    errorMessage: '',
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onsubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30}) // Corrected 'expire' to 'expires'
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({showErrorMsg: true, errorMessage: errorMsg})
  }

  onSubmitDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.onsubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  render() {
    const {showErrorMsg, errorMessage, showPassword} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="container">
        <div className="card">
          <img
            className="logo"
            src="https://res.cloudinary.com/dtin7rsfe/image/upload/v1735368007/NxtAssess-Logo.png"
            alt="NXT Assess Logo"
          />
          <h2 className="title">NXT Assess</h2>
          <form className="form" onSubmit={this.onSubmitDetails}>
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              id="username"
              className="input"
              type="text"
              placeholder="Enter your username"
              onChange={this.onChangeUserName}
            />
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              className="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              onChange={this.onChangePassword}
            />
            <div className="checkbox-container">
              <input
                className="checkbox"
                type="checkbox"
                id="showPassword"
                onChange={this.togglePasswordVisibility}
              />
              <label className="checkbox-label" htmlFor="showPassword">
                Show Password
              </label>
            </div>
            <button className="button" type="submit">
              Login
            </button>
            <p className="error-message">{showErrorMsg && errorMessage}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
