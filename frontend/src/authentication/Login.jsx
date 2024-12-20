import background from '@homepage-assets/coding-on-laptop.jpg'
import "./login.scss";
import Header from "../Header";



const Login = () => {
  return (
    
    <div className="bg" style={{'--backgroundImage': `url(${background})`}}>
      <Header/>
      <form action="action_page.php" method="post">
        <div className="con">
          <div className="signup">Login</div>
          <div className="name">
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
            <a className="user">
              <img src="/src/assets/user.svg" alt="" />
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

          <button type="submit">Login</button>

          <div className="reg">
            Don't have an account?<p> Register</p>
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

export default Login;

