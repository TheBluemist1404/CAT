import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../authentication/AuthProvider";

function NotificationLayout() {
  const navigate= useNavigate()
  const {isLoggedIn} = useContext(AuthContext)

  useEffect(()=>{
    if (!isLoggedIn) {
      navigate('/auth/login')
    }
  }, [isLoggedIn, navigate])

  return(
    isLoggedIn ? <Outlet/>: null
  )
}

export default NotificationLayout
