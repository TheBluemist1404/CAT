import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TimeMe from 'timeme.js';

function useSessionTimeTracker() {
  const location = useLocation();
  const previousPath = useRef("");

  useEffect(() => {
    // Initialize TimeMe only once
    TimeMe.initialize({ idleTimeoutInSeconds: 30 });
  }, []);

  useEffect(() => {
    // Stop the previous route's timer
    if (previousPath.current) {
      const timeSpent = TimeMe.getTimeOnPageInSeconds(previousPath.current);
      console.log("Time spent on route:", previousPath.current, timeSpent);
      // Send to API, etc.
      TimeMe.stopTimer(previousPath.current);
    }

    // Start a timer for the new route
    previousPath.current = location.pathname;
    TimeMe.startTimer(location.pathname);

    const handleSessionEnd = () =>{
      const timeSpent = TimeMe.getTimeOnPageInSeconds(previousPath.current);
      console.log(timeSpent)

      const payload = JSON.stringify({session: previousPath.current, timeSpent})
      // navigator.sendBeacon('api', payload)
    }

    window.addEventListener("beforeunload", handleSessionEnd)
    // Optionally clean up on unmount
    return () => {
      const timeSpent = TimeMe.getTimeOnPageInSeconds(location.pathname);
      console.log("Unmounted route:", location.pathname, timeSpent);
      // Send to API
      TimeMe.stopTimer(location.pathname);

      handleSessionEnd();
      window.removeEventListener("beforeunload", handleSessionEnd)
    };
  }, [location]);
}

export default useSessionTimeTracker;
