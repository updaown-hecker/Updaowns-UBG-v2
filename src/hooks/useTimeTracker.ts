import { useEffect, useState } from 'react';

const useTimeTracker = (): number => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = localStorage.getItem('startTime');

    if (startTime) {
      const startTimestamp = parseInt(startTime, 10);
      const currentTime = Date.now();
      setElapsedTime(currentTime - startTimestamp);
    } else {
      localStorage.setItem('startTime', Date.now().toString());
    }

    // Optional: If you want to continuously update the time while the user is on the page
    // const intervalId = setInterval(() => {
    //   const startTimestamp = parseInt(localStorage.getItem('startTime') || '0', 10);
    //   const currentTime = Date.now();
    //   setElapsedTime(currentTime - startTimestamp);
    // }, 1000); // Update every second

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []); // Empty dependency array ensures this runs only on mount

  return elapsedTime;
};

export default useTimeTracker;