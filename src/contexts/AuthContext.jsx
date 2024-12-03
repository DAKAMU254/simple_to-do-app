import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [users, setUsers] = useState(() => {
    // Load existing users from localStorage or initialize as an empty array
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const signup = (email, password) => {
    // Check if the email is already registered
    if (users.find(user => user.email === email)) {
      return { success: false, message: 'Email is already registered.' };
    }

    // Add the new user
    setUsers(prevUsers => [...prevUsers, { email, password }]);
    return { success: true, message: 'Signup successful.' };
  };

  const login = (email, password) => {
    // Validate credentials
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      setIsAuthenticated(true);
      return { success: true, message: 'Login successful.' };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
