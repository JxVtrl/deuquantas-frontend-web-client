import { useState, useEffect } from 'react';

export const useTime = () => {
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
};
