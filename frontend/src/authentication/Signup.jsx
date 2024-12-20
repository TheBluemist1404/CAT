import background from '@homepage-assets/coding-on-laptop.jpg'
import "./signup.scss";
import Header from "../Header";



const Signup = () => {
  return (
    
    <div className="bg" style={{'--backgroundImage': `url(${background})`}}>
      <Header/>
      <form action="action_page.php" method="post">
        <div className="con">
          <div className="signup">Join The CATs</div>
          <div className="name">
            <div className="wave-group">
              <input required type="text" className="input" />
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
            <a className="user">
              <img src="/src/assets/user.svg" alt="" />
            </a>
          </div>
          <div className="email">
              <div className="wave-group">
                <input required type="text" className="input" />
                <span className="bar"></span>
                <label className="label">
                  <span className="label-char" style={{ "--index": 0 }}>E</span>
                  <span className="label-char" style={{ "--index": 1 }}>m</span>
                  <span className="label-char" style={{ "--index": 2 }}>a</span>
                  <span className="label-char" style={{ "--index": 3 }}>i</span>
                  <span className="label-char" style={{ "--index": 4 }}>l</span>
                </label>
              </div>
              <a className="e">
                <img src="/src/assets/email.svg" alt="email" />
              </a>
          </div>
          
          <div className="password">
            <div className="wave-group">
              <input required type="password" className="input" />
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
            <a className="lock">
              <img src="/src/assets/lock.svg" alt="" />
            </a>
          </div>

          <button type="submit">Sign up</button>

          <div className="reg">
            Already have an account?<p> Login</p>
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
  );
};

export default Signup;
