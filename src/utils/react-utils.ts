const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      const tick = () => savedCallback.current();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
