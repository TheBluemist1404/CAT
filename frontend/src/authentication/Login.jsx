import axios from 'axios';


import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthProvider';

import background from '@homepage-assets/coding-on-laptop.jpg'
import "./login.scss";
import Header from "../Header";



const Login = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  //OAuth setup
  const rootURL = 'https://accounts.google.com/o/oauth2/v2/auth';
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  const qs = new URLSearchParams(options);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reponse = await axios.post('http://localhost:3000/api/v1/auth/login', { email: email, password: password })
      const token = reponse.data;
      localStorage.removeItem('token')
      localStorage.setItem('token', JSON.stringify(token));
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed", error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn])

  const toLogin = () => {
    navigate('/auth/signup')
  }
  return (
    <div className="login">
      <div className="bg" style={{ '--backgroundImage': `url(${background})` }}>
        <Header isAuth={true}/>
        <form action="action_page.php" method="post" onSubmit={handleSubmit}>
          <div className='con'>
            <div className="auth-con">
              <div className="heading">Login</div>
              <div className="name">
                <div className="wave-group">
                  <a className="user">
                    <img src="/src/assets/user.svg" alt="" />
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
                    <img src="/src/assets/lock.svg" alt="" />
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
              <div className="forget" onClick={()=>{navigate('/auth/forgot')}}>Forget password?</div>
              <button type="submit">Login</button>
              <div className="reg">
                Don't have an account?<p onClick={toLogin}> Register</p>
              </div>
            </div>

            <div style={{marginBottom: '20px', display: 'flex', flexDirection: 'row', gap: '50px'}}>
              <a className="fb">
                <img src="/src/assets/facebook-svgrepo-com.svg" alt="" style={{width: '50px'}}/>
              </a>
              <a className="gg" href={`${rootURL}?${qs.toString()}`} style={{width: '50px'}}>
                <img src="/src/assets/gmail.svg" alt="" />
              </a>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;

