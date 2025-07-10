import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL

// Backend response structure
interface LoginApiResponse {
  status: string;
  statusCode: number;
  message: string;
  time: string;
  data: {
    token: string;
    userName: string;
    name: string;
    email?: string;
    userRole: 'admin' | 'STAFF' | 'operator';
  };
}

// Local user model
interface User {
  username: string;
  name: string;
  email?: string;
  userRole: 'admin' | 'STAFF' | 'operator';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('quickbus_token');
    const userData = localStorage.getItem('quickbus_user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('quickbus_token');
        localStorage.removeItem('quickbus_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post<LoginApiResponse>(`${baseUrl}/auth/login`, {
        username,
        password,
      });

      const { status, statusCode, data } = response.data;

      if (status === 'SUCCESS' && statusCode === 200 && data.token) {
        const userObj: User = {
          username: data.userName,
          name: data.name,
          email: data.email || '',
          userRole: data.userRole,
        };

        localStorage.setItem('quickbus_token', data.token);
        localStorage.setItem('quickbus_user', JSON.stringify(userObj));
        setUser(userObj);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login failed:', error?.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('quickbus_token');
    localStorage.removeItem('quickbus_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};