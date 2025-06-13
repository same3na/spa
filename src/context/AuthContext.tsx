import { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null
  groupId: string | null
  isAuthenticated: boolean
  hasGroupId: boolean
  login: (token:string) => void
  logout: () => void
  useGroup: (token:string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [groupId, setGroupId] = useState<string | null>(localStorage.getItem('group_id'));

  const login = (jwt:string) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const useGroup = (groupId:string) => {
    localStorage.setItem('group_id', groupId);
    setGroupId(groupId)
  }

  const isAuthenticated = !!token;
  const hasGroupId = !!groupId;

  return (
    <AuthContext.Provider value={{ token, groupId, login, logout, useGroup, isAuthenticated, hasGroupId }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
