import logo from "/src/assets/bg-logo.svg"

import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <div className="head">Hey the lost CAT!</div>
      <button
        className="back"
        onClick={() => {
          navigate("/");
        }}
      >
        <div>Lets get you back home</div>
        <div className="container">
          <img src={logo} alt="" />
        </div>
      </button>
    </div>
  );
}

export default NotFound;
