import React, { useEffect, useState, useCallback } from "react";

let logoutTimer;
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpiration, setTokenExpiration] = useState();
  const [userId, setUserId] = useState(null);

  const login = useCallback((id, token, expirationDate) => {
    setToken(token);
    setUserId(id);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour
    setTokenExpiration(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: id,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpiration(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiration]);

  useEffect(() => {
    const credentials = JSON.parse(localStorage.getItem("userData"));
    if (
      credentials &&
      credentials.token &&
      new Date(credentials.expiration) > new Date()
    ) {
      login(
        credentials.userId,
        credentials.token,
        new Date(credentials.expiration)
      );
    }
  }, [login]);

  return {
    token,
    login,
    logout,
    userId,
  };
};
