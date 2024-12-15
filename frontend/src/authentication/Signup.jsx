import React from 'react';
import './register.css'; 
import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";

const Register = () => {
  return (
    <div>
      <form action="action_page.php" method="post">
        <div className="taskbar">
          <nav className="link">
            <a className="logo"><img src="CAT-removebg-preview.png" alt="logo" /></a>
            <a>About</a>
            <a>Forum</a>
            <a>LiveCode</a>
            <a>Contact</a>
          </nav>
        </div>
      </form>

      <form action="action_page.php" method="post">
        <div className="container">
          <div className="signup">Join The CATs</div>
          
          <div className="name">
            <div className="wave-group">
              <input required="" type="text" className="input" />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ '--index': 0 }}>N</span>
                <span className="label-char" style={{ '--index': 1 }}>a</span>
                <span className="label-char" style={{ '--index': 2 }}>m</span>
                <span className="label-char" style={{ '--index': 3 }}>e</span>
              </label>
            </div>
            <a className="user"><i className="fa-solid fa-user" style={{ fontSize: '25px', color: 'rgb(255, 255, 255)' }}></i></a>
          </div>

          <div className="email">
            <div className="wave-group">
              <input required="" type="text" className="input" />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ '--index': 0 }}>E</span>
                <span className="label-char" style={{ '--index': 1 }}>m</span>
                <span className="label-char" style={{ '--index': 2 }}>a</span>
                <span className="label-char" style={{ '--index': 3 }}>i</span>
                <span className="label-char" style={{ '--index': 4 }}>l</span>
              </label>
            </div>
            <a className="e"><i className="fa-regular fa-envelope" style={{ fontSize: '25px', color: 'rgb(255, 255, 255)' }}></i></a>
          </div>

          <div className="password">
            <div className="wave-group">
              <input required="" type="password" className="input" />
              <span className="bar"></span>
              <label className="label">
                <span className="label-char" style={{ '--index': 0 }}>P</span>
                <span className="label-char" style={{ '--index': 1 }}>a</span>
                <span className="label-char" style={{ '--index': 2 }}>s</span>
                <span className="label-char" style={{ '--index': 3 }}>w</span>
                <span className="label-char" style={{ '--index': 4 }}>o</span>
                <span className="label-char" style={{ '--index': 5 }}>r</span>
                <span className="label-char" style={{ '--index': 6 }}>d</span>
              </label>
            </div>
            <a className="lock"><i className="fa-solid fa-lock" style={{ fontSize: '25px', color: 'rgb(255, 255, 255)' }}></i></a>
          </div>

          <button type="submit">login</button>
          
          <div className="reg">Don't have an account?<p> Register</p></div>
          <a className="fb"><i className="fab fa-facebook" style={{ fontSize: '30px', color: 'rgb(255, 255, 255)' }}></i></a>
          <a className="gg"><i className="fa-brands fa-google" style={{ fontSize: '30px', color: 'rgb(255, 255, 255)' }}></i></a>
        </div>
      </form>
    </div>
  );
}

export default Register;
