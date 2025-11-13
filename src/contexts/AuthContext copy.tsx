import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'hr_manager' | 'employee';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database with separate roles table structure
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@company.com', password: 'admin123' },
  { id: '2', name: 'HR Manager', email: 'hr@company.com', password: 'hr123' },
  { id: '3', name: 'John Employee', email: 'john@company.com', password: 'emp123' },
];

// Separate roles table (simulating database structure)
const mockUserRoles = [
  { userId: '1', role: 'admin' as UserRole },
  { userId: '2', role: 'hr_manager' as UserRole },
  { userId: '3', role: 'employee' as UserRole },
];

const permissions = {
  admin: [
    'view_all_employees',
    'edit_employees',
    'delete_employees',
    'manage_payroll',
    'manage_recruitment',
    'view_all_attendance',
    'approve_leave',
    'view_analytics',
    'manage_performance',
    'export_data',
    'send_emails',
  ],
  hr_manager: [
    'view_all_employees',
    'edit_employees',
    'manage_recruitment',
    'view_all_attendance',
    'approve_leave',
    'view_analytics',
    'manage_performance',
    'export_data',
    'send_emails',
  ],
  employee: [
    'view_own_profile',
    'mark_attendance',
    'apply_leave',
    'view_own_payroll',
    'view_own_performance',
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userRole = mockUserRoles.find(r => r.userId === foundUser.id);
      if (userRole) {
        const authenticatedUser: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: userRole.role,
        };
        setUser(authenticatedUser);
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return permissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
