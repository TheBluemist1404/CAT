import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const tokenStr = localStorage.getItem("token");
  const token = JSON.parse(tokenStr);

  async function fetch(token, Promise) {
    try {
      const response = await Promise;
      if (response) return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // accessToken expired
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/token`,
            { refreshToken: token.refreshToken }
          );
          const newAccessToken = response.data.accessToken;
          token.accessToken = newAccessToken;
          localStorage.setItem("token", JSON.stringify(token));

          const newResponse = await Promise;
          if (response) return newResponse.data;
        } catch (error) {
          if (error.response && error.response.status === 400) {
            //refreshToken expired
            logout();
          }
        }
      }
    }
  }

  const logout = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/logout`, {
        data: { refreshToken: token.refreshToken },
      }); //axios.delete is treated different
      if (isLoggedIn) setIsLoggedIn(false);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, setIsLoggedIn, user, setUser, fetch }}>
      {children}
    </AuthContext.Provider>
  );
};
