import { ReactNode, useState } from 'react';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem('userEmail') || null
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem('userRole') || null
  );

  const login = (email: string, role: string) => {
    setUserEmail(email);
    setUserRole(role);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setUserEmail(null);
    setUserRole(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ userEmail, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
