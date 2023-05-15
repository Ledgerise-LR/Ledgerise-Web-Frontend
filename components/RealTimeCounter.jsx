import React, { useState, useEffect } from 'react';

function formatTime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedTime = `${days}:${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  return formattedTime;
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}


function RealTimeCounter({ interval }) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [interval]);

  return (
    <div className='flex flex-1 items-center ml-4'>
      <div className='text-xl text-white'>{formatTime(interval - counter)}</div>
    </div>
  );
}

export default RealTimeCounter;
