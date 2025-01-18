import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import './forgot.scss'

function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [getOtp, setGetOtp] = useState(false)
  const [otpMatch, setOtpMatch] = useState(true)
  const [otp, setOtp] = useState("");
  const [reset, setReset] = useState(false);
  const [otpToken, setOtpToken] = useState();

  const [pass, setPass] = useState();
  const [confirm, setConfirm] = useState();
  const [confirmMatch, setConfirmMatch] = useState(true)

  const handleMail = async (e) => {
    e.preventDefault();
    try {
      console.log(email);
      const response = await axios.post('http://localhost:3000/api/v1/auth/forgot', { email: email })
      if (response.status === 200) {
        setGetOtp(true);
      }
      console.log(response.data)
      return;
    } catch (error) {
      console.error("fail to send email", error)
    }
  }

  const handleOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/otp', { email: email, otp: otp })
      console.log(response.data.otpToken)
      if (response) {
        setOtpToken(response.data.otpToken)
        setReset(true);
      }
      return;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setOtpMatch(false)
      }
      console.error("fail to send otp", error)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      console.log(otpToken)
      const response = await axios.patch('http://localhost:3000/api/v1/auth/reset-password', { password: pass, confirmPassword: confirm }, { headers: { 'Authorization': `Bearer ${otpToken}` } })
      console.log(response)
      if (response.status === 200) {
        navigate('/auth/login')
      }
      return;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setConfirmMatch(false)
      }
      console.error("fail to reset password", error.response)
    }
  }

  const renderGetOtop = () => (
    <div>
      {!getOtp ? (<form className="enter-email" onSubmit={handleMail}>
        <h1>Forgot password?</h1>
        <p>To reset your password, please enter the email address associated with your account</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" required={true} placeholder="cat@example.com" onChange={(e) => { setEmail(e.target.value) }} />
        <button type="submit" style={{ width: '100%' }} >Get OTP</button>
      </form>) : (<form className="verify-otp" onSubmit={handleOTP}>
        <label htmlFor="otp">Enter your OTP here</label>
        <input id="otp" type="text" required={true} placeholder="******" onChange={(e) => { setOtp(e.target.value) }} />
        {!otpMatch && <span style={{color: 'var(--highlight-red)', fontSize: '14px  '}}>OTP not correct!</span>}
        <button type="submit">Verify</button>
      </form>)}
    </div>
  )

  const renderResetPass = () => (
    <div>
      <form className="reset-password" onSubmit={handleReset}>
        <h1>Reset password</h1>
        <p>Let's get you a new password!</p>

        <label htmlFor="reset">New password</label>
        <input id="reset" type="password" required={true} onChange={(e) => { setPass(e.target.value) }} />

        <label htmlFor="confirm">Confirm new password</label>
        <input id="confirm" type="password" required={true} onChange={(e) => { setConfirm(e.target.value) }} />
        {!confirmMatch && <span style={{color: 'var(--highlight-red)', fontSize: '14px  '}}>Password does not match, try again!</span>}

        <button type="submit">Reset</button>
      </form>
    </div>
  )
  return (
    <div className="forgot" >
      <div className="container">
        {!reset ? (renderGetOtop()) : (
          renderResetPass())}
      </div>
    </div>
  )
}

export default Forgot