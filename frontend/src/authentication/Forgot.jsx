import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import './forgot.scss'

function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [getOtp, setGetOtp] = useState(false)
  const [otp, setOtp] = useState("");
  const [reset, setReset] = useState(false);
  const [otpToken, setOtpToken] = useState();

  const [pass, setPass] = useState();
  const [confirm, setConfirm] = useState();

  const handleMail = async (e) => {
    e.preventDefault();
    try {
      console.log(email);
      const response = await axios.post('http://localhost:3000/api/v1/auth/forgot', { email: email })
      if (response.status === 200) {
        setGetOtp(true);
      }
      console.log(response.data)
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
    } catch (error) {
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
    } catch (error) {
      console.error("fail to reset password", error)
    }
  }

  const renderGetOtop = () => (
    <div>
      {!getOtp ? (<form className="enter-email" onSubmit={handleMail}>
        <h1>Forgot password?</h1>
        <p>To reset your password, please enter the email address associated with your account</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" required="true" placeholder="cat@example.com" onChange={(e) => { setEmail(e.target.value) }} />
        <button type="submit" style={{ width: '100%' }} >Get OTP</button>
      </form>) : (<form className="verify-otp" onSubmit={handleOTP}>
        <label htmlFor="otp">Enter your OTP here</label>
        <input id="otp" type="text" required="true" placeholder="******" onChange={(e) => { setOtp(e.target.value) }} />
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
        <input id="reset" type="password" onChange={(e) => { setPass(e.target.value) }} />

        <label htmlFor="confirm">Confirm new password</label>
        <input id="confirm" type="password" onChange={(e) => { setConfirm(e.target.value) }} />

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