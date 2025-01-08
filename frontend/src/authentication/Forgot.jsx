import axios from "axios";
import { useState } from "react"

function Forgot( ) {
  const [email, setEmail] = useState("")
  const handleMail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/forgot', {email: email})
    } catch (error) {
      console.error("fail to send email", error)
    }
  }

  return(
    <div className="forget" >
      <form className="enter-email" onSubmit={handleMail}>
        <label htmlFor="email">Enter your email to receive varification OTP</label>
        <input id="email" type="text" onChange={(e) => {setEmail(e.target.value)}} style={{marginLeft: '20px'}} />
        <button type="submit" >Send</button>
      </form>
    </div>
  )
}

export default Forgot