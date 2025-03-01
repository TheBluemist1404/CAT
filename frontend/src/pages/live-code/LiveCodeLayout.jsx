import { Outlet } from "react-router-dom";
import {useSessionTimeTracker} from "./useSessionTimeTracker";

function LiveCodeLayout({token}) {
  useSessionTimeTracker(token);

  return(
    <Outlet/>
  )
}

export default LiveCodeLayout
