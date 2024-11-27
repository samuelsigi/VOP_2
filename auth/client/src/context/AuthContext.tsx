import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';


interface User {
  token: string | null;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;

}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem('authToken');
      if (storedToken) {
        setUser({ token: storedToken });
        setIsAuthenticated(true);
      }
      setLoading(false); // Set loading to false after initialization
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    setUser({ token });
    setIsAuthenticated(true);
    sessionStorage.setItem('authToken', token); // Persist token
  };

  const logout = () => {
    const previousPage = window.location.href;
    sessionStorage.setItem('previousPage', previousPage);
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('authToken'); // Clear token
    // Optionally redirect to login page:
    window.location.href = '/login';  // or use React Router to navigate to login page
  };
  

  

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export {AuthContext,AuthProvider,useAuth}