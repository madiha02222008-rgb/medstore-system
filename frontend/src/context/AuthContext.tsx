import { createContext, useContext, useState, ReactNode } from "react";
import { api } from "../api/client";

interface User { id: string; name: string; email: string; role: string; }
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("medstore_user");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(email: string, password: string) {
    const result = await api.login(email, password);
    localStorage.setItem("medstore_token", result.token);
    localStorage.setItem("medstore_user", JSON.stringify(result.user));
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("medstore_token");
    localStorage.removeItem("medstore_user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider ke andar hi use karo");
  return ctx;
}
