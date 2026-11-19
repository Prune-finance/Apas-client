import { useCallback, useEffect, useRef, useState } from "react";

/** Seconds-based countdown, e.g. for "Resend code" buttons. */
export default function useCountdown(seconds: number, startImmediately = false) {
  const [remaining, setRemaining] = useState(startImmediately ? seconds : 0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  const start = useCallback(() => {
    stop();
    setRemaining(seconds);
    timer.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  useEffect(() => {
    if (startImmediately) start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;

  return { remaining, running: remaining > 0, start, label };
}
