import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthProvider';

import background from '@homepage-assets/coding-on-laptop.jpg'
import "./signup.scss";
import Header from "../Header";

import userIcon from "/src/assets/user.svg"
import emailIcon from "/src/assets/email.svg"
import lockIcon from "/src/assets/lock.svg"
import facebook from "/src/assets/facebook-svgrepo-com.svg"
import google from "/src/assets/google.png"

const Signup = () => {
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  //OAuth setup
  const googleRootURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const facebookRootURL = "https://www.facebook.com/v22.0/dialog/oauth";

  const googleRedirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const facebookClientId = import.meta.env.VITE_FACEBOOK_CLIENT_ID;
  const facebookRedirectUri = import.meta.env.VITE_FACEBOOK_REDIRECT_URI;

  const googleOptions = {
    redirect_uri: googleRedirectUri,
    client_id: googleClientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const facebookOptions = {
    client_id: facebookClientId,
    redirect_uri: facebookRedirectUri,
    response_type: "code",
    scope: "public_profile,email",
  };
  

  const googleAuthURL = `${googleRootURL}?${new URLSearchParams(googleOptions)}`;
  const facebookAuthURL = `${facebookRootURL}?${new URLSearchParams(facebookOptions)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/signup`, { fullName: fullName, email: email, password: password })
      navigate('/auth/login') 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("invalid email!")
      } else if 
      (error.response && error.response.status === 409) {
        setError("email already used!")
      }
      console.error("Signup failed", error)
    }
  }

  return (
    <div className="signup">
      <div className="bg" style={{ '--backgroundImage': `url(${background})` }}>
        <Header isAuth={true} />
        <div className="container" style={{marginTop: "10vh" ,transform: "translateY(30px)"}}>
          <form action="action_page.php" method="post" onSubmit={handleSubmit}>
            <div className="con">
              <div className="auth-con">
                <auth>
                  <div className="heading">Join The CATs</div>
                  {error && <div style={{position: 'absolute', width:'100%', left: '0', transform: 'translateY(10px)', color: 'var(--highlight-red)', fontSize: '16px'}}>{error}</div>}
                  <div className="name">
                    <div className="wave-group">
                      <a className="user">
                        <img src={userIcon} alt="" />
                      </a>
                      <input required type="text" className="input" value={fullName} onChange={(e) => { setFullName(e.target.value) }} />
                      <span className="bar"></span>
                      <label className="label">
                        <span className="label-char" style={{ "--index": 0 }}>F</span>
                        <span className="label-char" style={{ "--index": 1 }}>u</span>
                        <span className="label-char" style={{ "--index": 2 }}>l</span>
                        <span className="label-char" style={{ "--index": 3 }}>l</span>
                        <span className="label-char" style={{ "--index": 4, marginRight: "10px" }}> </span>
                        <span className="label-char" style={{ "--index": 5 }}>N</span>
                        <span className="label-char" style={{ "--index": 6 }}>a</span>
                        <span className="label-char" style={{ "--index": 7 }}>m</span>
                        <span className="label-char" style={{ "--index": 8 }}>e</span>
                      </label>
                    </div>
                  </div>
                  <div className="email">
                    <div className="wave-group">
                      <a className="e">
                        <img src={emailIcon} alt="email" />
                      </a>
                      <input required type="text" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                      <span className="bar"></span>
                      <label className="label">
                        <span className="label-char" style={{ "--index": 0 }}>E</span>
                        <span className="label-char" style={{ "--index": 1 }}>m</span>
                        <span className="label-char" style={{ "--index": 2 }}>a</span>
                        <span className="label-char" style={{ "--index": 3 }}>i</span>
                        <span className="label-char" style={{ "--index": 4 }}>l</span>
                      </label>
                    </div>
                  </div>
                  <div className="password">
                    <div className="wave-group">
                      <a className="lock">
                        <img src={lockIcon} alt="" />
                      </a>
                      <input required type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <span className="bar"></span>
                      <label className="label">
                        <span className="label-char" style={{ "--index": 0 }}>P</span>
                        <span className="label-char" style={{ "--index": 1 }}>a</span>
                        <span className="label-char" style={{ "--index": 2 }}>s</span>
                        <span className="label-char" style={{ "--index": 3 }}>w</span>
                        <span className="label-char" style={{ "--index": 4 }}>o</span>
                        <span className="label-char" style={{ "--index": 5 }}>r</span>
                        <span className="label-char" style={{ "--index": 6 }}>d</span>
                      </label>
                    </div>
                  </div>
                  <button className="submit-signup" type="submit">Sign up</button>
                  <div className="reg">
                    Already have an account?<p onClick={() => {navigate('/auth/login')}} > Login</p>
                  </div>
                </auth>
              </div>
              <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <button className="fb" onClick={() => (window.location.href = facebookAuthURL)}>
                  <img src={facebook} alt="" />
                </button>
                <button className="gg" onClick={() => (window.location.href = googleAuthURL)}>
                  <img src={google} alt="" />
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Signup;
