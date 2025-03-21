import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// Define the shape of a User
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
}

// Define the shape of the User Context
interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

// Create the User Context with an undefined default value for safety
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the props for the provider component
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component to wrap the app and provide user state
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  // On mount, attempt to load user data from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    }
  }, []);

  // Function to set the user state and persist to localStorage
  const setUser = (newUser: User) => {
    try {
      setUserState(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  };

  // Function to clear the user state and remove from localStorage
  const clearUser = () => {
    try {
      setUserState(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to allow easy access to the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;