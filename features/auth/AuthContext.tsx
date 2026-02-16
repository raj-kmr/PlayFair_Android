import {  createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store"

// Define the public shape of the authentication context
// ensure all consumers get consistent auth structure
interface AuthContextType {
    isAuthenticated: boolean | null;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

// Allow auth provider to wrap and render nested components
interface Props {
    children: ReactNode
}

// Create context with explicit type to ensure type safety 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// provides global authetication state and actions to the app
export const AuthProvider = ({ children }: Props) => {
    // null = auth state is not determind(loading screen)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    // on app load check if token exists and restore auth state
    useEffect(() => {
        const loadToken  = async () => {
            const token = await SecureStore.getItemAsync("token")
            setIsAuthenticated(!!token)
        };

        loadToken();
    }, [])

    // update auth state after successful login
    const login = async (token: string) => {
        await SecureStore.setItemAsync("token", token)
        setIsAuthenticated(true);
    }  

    // remove token and update auth state
    const logout = async () => {
        await SecureStore.deleteItemAsync("token")
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

// custom hook to access authContext easily 
export const useAuth = () => {
  const context = useContext(AuthContext);

  // throw error if used outside auth provider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
