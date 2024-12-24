import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="header-guest">
      <div className="logo" onClick={()=>{navigate('/')}}>
        <img src="Assests/Logo.svg" alt="N/A" />
      </div>
      <div className="searchbar">
        <div className="search-icon"></div>
        <input type="text" placeholder="Search C.A.T..." />
      </div>
      <div className="header-button">
        <button className="login-button">Login</button>
        <button className="signup-button">Sign up</button>
      </div>
    </header>
  );
}

export default Header;
