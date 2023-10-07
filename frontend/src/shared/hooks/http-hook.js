import { useCallback, useRef, useState, useEffect } from "react";
export const useHttpClient = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);
      try {
        const resp = await fetch(url, {
          method: method,
          body: JSON.stringify(body),
          headers: headers,
          signal: httpAbortController.signal,
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data?.message || "Can't fetch users");
        }
        console.log(data);
        setIsLoading(false);
        return data;
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
    isLoading(false);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortController) =>
        abortController.abort()
      );
    };
  }, []);
  return {
    isLoading: isLoading,
    error: error,
    sendRequest: sendRequest,
    clearError: clearError,
  };
};
