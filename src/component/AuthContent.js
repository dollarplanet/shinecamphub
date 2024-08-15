import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [healer, setHealer] = useState(null); // State for healer
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('shinecampus_token');

    if (token) {
      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
        return;
      }

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout();
      } else {
        const userType = decoded.userId ? 'user' : 'healer'; // Determine if the token belongs to a user or healer

        axios.get(`http://localhost:3003/${userType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (userType === 'user') {
            setUser(response.data.user);
          } else {
            setHealer(response.data.healer);
          }
          setIsLoggedIn(true);
        })
        .catch(error => {
          console.error('Failed to fetch user data:', error);
          setIsLoggedIn(false);
          logout();
        });
      }
    }
  }, []);

  const login = (userData) => {
    if (userData.userId) {
      setUser(userData);
    } else {
      setHealer(userData);
    }
    setIsLoggedIn(true);
    localStorage.setItem('shinecampus_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setHealer(null); // Reset healer state
    setIsLoggedIn(false);
    localStorage.removeItem('shinecampus_token');
  };

  return (
    <AuthContext.Provider value={{ user, healer, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

