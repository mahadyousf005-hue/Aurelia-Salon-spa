import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiRequest, getStoredUser, setStoredAuth, clearStoredAuth } from '../data/api';
import { supabase } from '../data/supabase';

export type ScreenName =
  | 'RoleSelection'
  | 'Login'
  | 'Register'
  | 'Home'
  | 'Services'
  | 'BookAppointment'
  | 'MyAppointments'
  | 'Appointments'
  | 'Promotions'
  | 'Staff'
  | 'Schedule'
  | 'Availability'
  | 'AdminAvailability'
  | 'Customers'
  | 'Payments'
  | 'Profile';

interface NavigationParams {
  role?: UserRole;
  signupMessage?: string;
  service?: any;
  category?: string;
  adminMode?: boolean;
}

interface AuthContextType {
  user: User | null;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
  currentScreen: ScreenName;
  screenParams: NavigationParams;
  navigate: (screen: ScreenName, params?: NavigationParams) => void;
  resetNavigation: (screen: ScreenName, params?: NavigationParams) => void;
  login: (email: string, password?: string, roleRequirement?: UserRole | null) => Promise<User>;
  register: (name: string, email: string, phone: string, password: string, role?: UserRole) => Promise<string>;
  logout: () => Promise<void>;
  updateProfile: (name: string, phone: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('RoleSelection');
  const [screenParams, setScreenParams] = useState<NavigationParams>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await loadProfile(session.user.id, session.access_token);
          setUser(profile);
          setStoredAuth(session.access_token, profile);
          setCurrentScreen('Home');
        } else {
          setCurrentScreen('RoleSelection');
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const loadProfile = async (userId: string, accessToken: string): Promise<User> => {
    const { data, error } = await supabase.from('profiles').select('id, full_name, email, phone, role').eq('id', userId).single();
    if (error) throw new Error(error.message);
    return { id: data.id, name: data.full_name, email: data.email, phone: data.phone || '', role: data.role as UserRole, token: accessToken };
  };

  const navigate = (screen: ScreenName, params: NavigationParams = {}) => {
    setScreenParams(params);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetNavigation = (screen: ScreenName, params: NavigationParams = {}) => {
    setScreenParams(params);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const login = async (email: string, password: string = '', roleRequirement?: UserRole | null): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ token: string; user: User }>('/auth/login', 'POST', {
        email: email.trim().toLowerCase(),
        password
      });
      const authenticatedUser = response.user;

      if (roleRequirement && authenticatedUser.role !== roleRequirement) {
        throw new Error(
          `This account is registered as ${
            authenticatedUser.role === 'admin'
              ? 'Administrator'
              : authenticatedUser.role === 'staff'
              ? 'Staff Member'
              : 'Customer'
          }. Please select the matching role to continue.`
        );
      }

      setStoredAuth(response.token, authenticatedUser);
      setUser(authenticatedUser);
      resetNavigation('Home');
      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, role: UserRole = 'customer'): Promise<string> => {
    if (role !== 'customer' && role !== 'staff') throw new Error('Only customer and staff registration is allowed.');
    const response = await apiRequest<{ message?: string }>('/auth/register', 'POST', { name, email, phone, password, role });
    return response.message || 'Account created successfully. You can now log in.';
  };

  const logout = async () => {
    await supabase.auth.signOut();
    clearStoredAuth();
    setUser(null);
    setSelectedRole(null);
    resetNavigation('RoleSelection');
  };

  const updateProfile = async (name: string, phone: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) throw new Error('Your session has expired. Please log in again.');
    const { data, error } = await supabase.from('profiles').update({ full_name: name, phone }).eq('id', sessionData.session.user.id).select('id, full_name, email, phone, role').single();
    if (error) throw new Error(error.message);
    const updated = { id: data.id, name: data.full_name, email: data.email, phone: data.phone || '', role: data.role as UserRole, token: sessionData.session.access_token };
    setStoredAuth(sessionData.session.access_token, updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedRole,
        setSelectedRole,
        currentScreen,
        screenParams,
        navigate,
        resetNavigation,
        login,
        register,
        logout,
        updateProfile,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
