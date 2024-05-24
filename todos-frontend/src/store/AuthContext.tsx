import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import * as api from "../utils/api";
import { User } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res);
  };

  const register = async (email: string, password: string) => {
    console.log("register")
    await api.register(email, password);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getUser();
        setUser(res);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
