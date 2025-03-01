import axios from "axios";
import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import TimeMe from "timeme.js";
import { AuthContext } from "../../authentication/AuthProvider";

export function useSessionTimeTracker(token) {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = useRef("");

  useEffect(() => {
    // Initialize TimeMe only once
    TimeMe.initialize({ idleTimeoutInSeconds: 30 });
  }, []);

  useEffect(() => {
    // Start a timer for the new route
    currentPath.current = location.pathname;
    TimeMe.startTimer(location.pathname);

    const handleSessionEnd = async () => {
      const timeSpent = TimeMe.getTimeOnPageInSeconds(location.pathname);
      console.log("Unmounted route:", location.pathname, timeSpent);
      const response = await axios.patch(
        `http://localhost:3000/api/v1/profile/edit/${user._id}`,
        { fullName: user.fullName, duration: user.duration + timeSpent },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      );

      TimeMe.resetRecordedPageTime(location.pathname);

      if (response) {
        console.log(response.data);
        setUser((prevUser) =>({
          ...prevUser,
          duration: prevUser.duration + timeSpent
        }))
      }
    };

    window.addEventListener("beforeunload", handleSessionEnd);
    // Optionally clean up on unmount
    return () => {
      handleSessionEnd();
      window.removeEventListener("beforeunload", handleSessionEnd);
    };
  }, [location]);
}
