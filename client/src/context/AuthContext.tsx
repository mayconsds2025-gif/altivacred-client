import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthData {
  nome: string;
  email: string;
  cpf?: string;
  foto?: string; // ✅ campo correto usado no restante do app
}

interface AuthContextType {
  user: AuthData | null;
  login: (userData: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthData | null>(() => {
    const savedUser = localStorage.getItem("altiva_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: AuthData) => {
    setUser(userData);
    localStorage.setItem("altiva_user", JSON.stringify(userData));
    if (userData.cpf) localStorage.setItem("userCpf", userData.cpf);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("altiva_user");
    localStorage.removeItem("userCpf");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
