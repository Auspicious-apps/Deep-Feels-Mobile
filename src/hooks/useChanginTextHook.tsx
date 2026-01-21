import { useEffect, useState } from "react";

export const useChangingText = (
  messages: string[],
  interval: number = 2000
) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval]);

  return messages[index];
};
