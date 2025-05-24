import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ar';
type UserRole = 'investor' | 'advertiser' | 'admin' | 'municipality';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  language: Language;
  isRTL: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  setLanguage: (lang: Language) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>('en');
  const isRTL = language === 'ar';

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
    
    // Check for saved auth state
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    // Update document direction based on language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login for now - would connect to Supabase in production
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        role: 'investor',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true);
    try {
      // Mock signup for now - would connect to Supabase in production
      const mockUser: User = {
        id: '1',
        email,
        name,
        role,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Mock logout for now - would connect to Supabase in production
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      language, 
      isRTL,
      login, 
      signup, 
      logout,
      setLanguage
    }}>
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
