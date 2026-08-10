import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('warehouse_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return {
      name: 'Harshal (Student Lead)',
      email: 'ce.student@college.edu',
      role: 'Project Researcher / Student',
      rollNo: 'CE-2022-042',
      isLoggedIn: true
    };
  });

  const login = (email, password, remember = true) => {
    const userData = {
      name: email.split('@')[0] || 'CE Student',
      email: email,
      role: 'Project Reviewer',
      rollNo: 'CE-2022-DEMO',
      isLoggedIn: true
    };
    setUser(userData);
    if (remember) {
      localStorage.setItem('warehouse_user', JSON.stringify(userData));
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('warehouse_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
