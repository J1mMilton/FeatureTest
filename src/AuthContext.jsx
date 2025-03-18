// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, load the current user from localStorage (if any)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login by checking against stored users in localStorage
  const login = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = storedUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  // Sign up by adding new users to localStorage
  const signup = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (storedUsers.find((u) => u.username === username)) {
      // User already exists
      return false;
    }
    const newUser = { username, password };
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
