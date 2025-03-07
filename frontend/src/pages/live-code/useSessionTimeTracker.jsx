import axios from "axios";
import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import TimeMe from "timeme.js";
import { AuthContext } from "../../authentication/AuthProvider";

export function useSessionTimeTracker(token) {
  const { user, setUser, fetch } = useContext(AuthContext);
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
      const data = await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/profile/edit/${user._id}`,
        { fullName: user.fullName, duration: user.duration + timeSpent },
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      )

      TimeMe.resetRecordedPageTime(location.pathname);

      if (data) {
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
