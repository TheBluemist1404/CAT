import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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
      const response = await axios.patch('http://localhost:3000/api/v1/auth/reset-password', { password: pass, confirmPassword: confirm}, {headers: {'Authorization': `Bearer ${otpToken}`}})
      console.log(response)
      if (response.status === 200) {
        navigate('/auth/login')
      }
    } catch (error) {
      console.error("fail to reset password", error)
    }
  }

  const renderResetPass = () => (
    <div>
      <form className="confirm-password" onSubmit={handleReset} style={{ marginTop: '20px' }}>
        <div>
          <label htmlFor="reset">New pass word</label>
          <input id="reset" type="password" onChange={(e) => { setPass(e.target.value) }} style={{ marginLeft: '20px' }} />
        </div>
        <div>
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" onChange={(e) => { setConfirm(e.target.value) }} style={{ marginLeft: '20px' }} />
        </div>
        <button type="submit">Reset password</button>
      </form>
    </div>
  )
  return (
    <div className="forget" >
      <div>
        <form className="enter-email" onSubmit={handleMail}>
          <label htmlFor="email">Enter your email to receive varification OTP</label>
          <input id="email" type="text" onChange={(e) => { setEmail(e.target.value) }} style={{ marginLeft: '20px' }} />
          <button type="submit" >Get OTP</button>
        </form>
        <form className="verify-otp" onSubmit={handleOTP} style={{ marginTop: '20px' }}>
          <label htmlFor="otp">Enter your OTP here</label>
          <input id="otp" type="text" onChange={(e) => { setOtp(e.target.value) }} style={{ marginLeft: '20px' }} />
          <button type="submit">Send</button>
        </form>
      </div>
      {reset && renderResetPass()}
    </div>
  )
}

export default Forgot