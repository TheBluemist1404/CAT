import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useState, useContext} from 'react';
import { AuthContext } from './AuthProvider';

import background from '@homepage-assets/coding-on-laptop.jpg'
import "./signup.scss";
import Header from "../Header";



const Signup = () => {
  const {setUser, setIsLoggedIn} = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reponse = await axios.post('http://localhost:3000/api/v1/auth/signup', {fullName: fullName, email: email, password: password});
      const user = reponse.data.user;
      setUser(user);
      setIsLoggedIn(true);
      navigate('/');

    } catch (error) {
      console.error("Signup failed", error)
    }
  }

  return (    
    <div className="signup">
      <div className="bg" style={{'--backgroundImage': `url(${background})`}}>
        <Header/>
        <form action="action_page.php" method="post" onSubmit={handleSubmit}>
          <div className="con">
            <div className="signup">Join The CATs</div>
            <div className="name">
              <div className="wave-group">
                <a className="user">
                  <img src="/src/assets/user.svg" alt="" />
                </a>
                <input required type="text" className="input" value={fullName} onChange={(e)=>{setFullName(e.target.value)}} />
                <span className="bar"></span>
                <label className="label">
                  <span className="label-char" style={{ "--index": 0 }}>F</span>
                  <span className="label-char" style={{ "--index": 1 }}>u</span>
                  <span className="label-char" style={{ "--index": 2 }}>l</span>
                  <span className="label-char" style={{ "--index": 3 }}>l</span>
                  <span className="label-char" style={{ "--index": 4,marginRight: "10px" }}> </span>
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
                    <img src="/src/assets/email.svg" alt="email" />
                  </a>
                  <input required type="text" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
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
                <input required type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)}/>
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
            <button type="submit">Sign up</button>
            <div className="reg">
              Already have an account?<p > Login</p>
            </div>
            <a className="fb">
              <img src="/src/assets/facebook-svgrepo-com.svg" alt="" />
            </a>
            <a className="gg">
              <img src="/src/assets/gmail.svg" alt="" />
            </a>
          </div>
        </form>
      
      </div>
    </div>
  );
};

export default Signup;
