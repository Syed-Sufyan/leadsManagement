import React, { createContext, useEffect, useState, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isLoggedin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<any>; 
  logout: () => Promise<void>;
  refreshUser: () => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
     const userData = currentUser.toJSON(); 
    setUser(userData as FirebaseAuthTypes.User);
    }
  };

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (isLoading) setIsLoading(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const login = async (email: string, pass: string) => {
    await auth().signInWithEmailAndPassword(email, pass);
  };

  const signup = async (email: string, pass: string) => {
    return await auth().createUserWithEmailAndPassword(email, pass);
  };

  const logout = async () => {
    await auth().signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedin: !!user, 
      isLoading, 
      login, 
      signup, 
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};