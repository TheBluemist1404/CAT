import { Outlet, useNavigate } from "react-router-dom";
import {useSessionTimeTracker} from "./useSessionTimeTracker";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../authentication/AuthProvider";

function LiveCodeLayout({token}) {
  const navigate= useNavigate()
  const {isLoggedIn} = useContext(AuthContext)

  useEffect(()=>{
    if (!isLoggedIn) {
      navigate('/auth/login')
    }
  }, [isLoggedIn, navigate])

  useSessionTimeTracker(token);

  return(
    isLoggedIn ? <Outlet/>: null
  )
}

export default LiveCodeLayout
