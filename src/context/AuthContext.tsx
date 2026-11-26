import React, { createContext, useContext, useState } from 'react';
import { User, Role } from '../types/common';
import { mockCurrentUser } from '../lib/mockData';

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  switchRole: (role: Role) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockCurrentUser);

  const switchRole = (role: Role) => {
    setUser((prev) => ({
      ...prev,
      role,
      name:
        role === 'fm_mgr'
          ? 'Dave Vance (FM Manager)'
          : role === 'fm_coord'
          ? 'Ishika Bhatia (FM Coordinator)'
          : role === 'technician'
          ? 'Tom Bradley (Lead FM Tech)'
          : role === 'contractor'
          ? 'Alex Chen (KONE Elevators)'
          : role === 'fm_client'
          ? 'Marcus Sterling (Client Rep)'
          : 'Ishika Bhatia (Administrator)',
    }));
  };

  const hasPermission = (perm: string): boolean => {
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(perm);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
