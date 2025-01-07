import { createContext } from 'react';

interface AuthContextType {
  userEmail: string | null;
  userRole: string | null;
  login: (email: string, role: string) => void;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType | null>(null);
