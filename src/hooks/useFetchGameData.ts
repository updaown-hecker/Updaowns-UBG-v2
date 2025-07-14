import { useState, useEffect } from 'react';

export function useFetchGameData() {
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(() => {
    const storedCount = localStorage.getItem('totalGamesPlayed');
    return storedCount ? parseInt(storedCount, 10) : 0;
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedCount = localStorage.getItem('totalGamesPlayed');
    setTotalGamesPlayed(storedCount ? parseInt(storedCount, 10) : 0);
  }, []); // Empty dependency array to run only once on mount

  return { totalGamesPlayed };
}
