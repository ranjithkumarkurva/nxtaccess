import Cookies from 'js-cookie'
import './index.css' // Make sure to import the CSS

const Header = ({history}) => {
  const handleLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <div className="logo-container">
        <img
          className="logo"
          src="https://res.cloudinary.com/dtin7rsfe/image/upload/v1735368007/NxtAssess-Logo.png"
          alt="NXT Assess Logo"
        />
        <h1 className="title">NXT Assess</h1>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default Header
