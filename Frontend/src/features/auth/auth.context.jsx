import { createContext, useState } from "react";
import { getMe, logout } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
